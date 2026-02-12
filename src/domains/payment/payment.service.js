import BaseService from "../../common/base_classes/base-service.js";
import midtransClient from "midtrans-client";
import crypto from "crypto";
import Roles from "../../common/enums/user-roles.enum.js";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

class PaymentService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async ensureWallet(user) {
    if (user.role === Roles.Customer) {
      let wallet = await this.db.wallet.findUnique({
        where: { customer_id: user.id },
      });
      if (!wallet)
        wallet = await this.db.wallet.create({
          data: { customer_id: user.id },
        });
      return wallet;
    }
    if (user.role === Roles.Seller) {
      let wallet = await this.db.wallet.findUnique({
        where: { seller_id: user.id },
      });
      if (!wallet)
        wallet = await this.db.wallet.create({ data: { seller_id: user.id } });
      return wallet;
    }
    throw this.error.badRequest("Invalid role");
  }

  async getWalletBalance(user) {
    const wallet = await this.ensureWallet(user);
    return { balance: wallet.balance };
  }

  async createTopup(user, amountRaw) {
    const amount = Number(amountRaw);
    if (!amount || amount <= 0) throw this.error.badRequest("Invalid amount");
    if (user.role !== Roles.Customer)
      throw this.error.forbidden("Only borrower can topup");

    const ts = Date.now().toString().slice(-8);
    const uid = user.id.slice(0, 8);

    const orderId = `TP-${uid}-${ts}`;

    const parameter = {
      transaction_details: { order_id: orderId, gross_amount: amount },
      customer_details: { email: user.email, first_name: user.name },
    };

    const tx = await snap.createTransaction(parameter);
    await this.db.payment.create({
      data: {
        type: "TOPUP",
        customer_id: user.id,
        amount,
        status: "PENDING",
        order_id: orderId,
        snap_token: tx.token,
        redirect_url: tx.redirect_url,
      },
    });

    return { orderId, redirectUrl: tx.redirect_url, token: tx.token };
  }

  verifySignature({ order_id, status_code, gross_amount, signature_key }) {
    const raw = `${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`;
    const expected = crypto.createHash("sha512").update(raw).digest("hex");
    return expected === signature_key;
  }

  async handleWebhook(body) {
    const {
      order_id,
      transaction_status,
      status_code,
      gross_amount,
      signature_key,
      transaction_id,
    } = body;

    if (
      !this.verifySignature({
        order_id,
        status_code,
        gross_amount,
        signature_key,
      })
    ) {
      throw this.error.forbidden("Invalid signature");
    }

    const payment = await this.db.payment.findUnique({ where: { order_id } });

    if (!payment) throw this.error.notFound("Payment not found");

    await this.db.payment.update({
      where: { order_id },
      data: {
        status: transaction_status,
        transaction_id,
        raw_notification: body,
      },
    });

    if (
      payment.type === "TOPUP" &&
      (transaction_status === "settlement" || transaction_status === "capture")
    ) {
      await this.db.wallet.update({
        where: { customer_id: payment.customer_id },
        data: { balance: { increment: Number(payment.amount) } },
      });
    }
  }

  async payWithBalance(user, loanId) {
    const loan = await this.db.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw this.error.notFound("Loan not found");
    if (loan.borrower_id !== user.id)
      throw this.error.forbidden("Not your loan");
    if (loan.status !== "ACCEPTED")
      throw this.error.badRequest("Loan not accepted");

    const lenderId = loan.lender_id;
    const amount = Number(loan.amount);

    const borrowerWallet = await this.ensureWallet(user);
    if (Number(borrowerWallet.balance) < amount)
      throw this.error.badRequest("Insufficient balance");

    let lenderWallet = await this.db.wallet.findUnique({
      where: { seller_id: lenderId },
    });
    if (!lenderWallet)
      lenderWallet = await this.db.wallet.create({
        data: { seller_id: lenderId },
      });

    const ops = [
      this.db.wallet.update({
        where: { id: borrowerWallet.id },
        data: { balance: { decrement: amount } },
      }),
      this.db.transfer.create({
        data: {
          from_customer_id: user.id,
          to_seller_id: lenderId,
          amount,
          status: "PENDING",
        },
      }),
      this.db.loan.update({
        where: { id: loanId },
        data: { status: "PAID" },
      }),
    ];

    const tx = await this.db.$transaction(ops);
    return {
      transferId: tx[1].id,
      amount,
      loanId,
      loanStatus: "PAID",
    };
  }
}

export default new PaymentService();
