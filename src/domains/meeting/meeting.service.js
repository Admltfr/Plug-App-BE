import BaseService from "../../common/base_classes/base-service.js";
import Roles from "../../common/enums/user-roles.enum.js";
import QRUtil from "../../utils/qr.util.js";

class MeetingService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async assertLoan(loanId) {
    const loan = await this.db.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw this.error.notFound("Loan not found");
    return loan;
  }

  async proposeLocation(user, loanId, { lat, lon, address }) {
    const loan = await this.assertLoan(loanId);
    if (loan.lender_id !== user.id) throw this.error.forbidden("Not your loan");
    if (!["ACCEPTED", "PAID"].includes(loan.status))
      throw this.error.badRequest("Loan must be ACCEPTED or PAID");

    const meeting = await this.db.meeting.upsert({
      where: { loan_id: loanId },
      update: { lat: lat, lon: lon, address: address, status: "PENDING" },
      create: { loan_id: loanId, lat: lat, lon: lon, address: address },
    });
    return meeting;
  }

  async locationDecision(user, loanId, decision) {
    const loan = await this.assertLoan(loanId);
    if (loan.borrower_id !== user.id)
      throw this.error.forbidden("Not your loan");

    const meeting = await this.db.meeting.findUnique({
      where: { loan_id: loanId },
    });
    if (!meeting) throw this.error.notFound("Meeting not found");
    if (meeting.status !== "PENDING")
      throw this.error.badRequest("Meeting not pending");

    const updated = await this.db.meeting.update({
      where: { loan_id: loanId },
      data: { status: decision === "ACCEPT" ? "ACCEPTED" : "REJECTED" },
    });
    return updated;
  }

  async getMeeting(user, loanId) {
    const loan = await this.assertLoan(loanId);
    const isMember =
      (user.role === Roles.Customer && loan.borrower_id === user.id) ||
      (user.role === Roles.Seller && loan.lender_id === user.id);
    if (!isMember) throw this.error.forbidden("Not a participant");

    const meeting = await this.db.meeting.findUnique({
      where: { loan_id: loanId },
    });
    return meeting ?? {};
  }

  async generateQr(user, loanId) {
    const loan = await this.assertLoan(loanId);
    if (loan.borrower_id !== user.id)
      throw this.error.forbidden("Not your loan");

    const meeting = await this.db.meeting.findUnique({
      where: { loan_id: loanId },
    });
    if (!meeting || meeting.status !== "ACCEPTED")
      throw this.error.badRequest("Meeting must be ACCEPTED");

    const token = QRUtil.generateToken();
    const expires = QRUtil.expiry(60);
    await this.db.meeting.update({
      where: { loan_id: loanId },
      data: { qr_token: token, qr_expires: expires },
    });
    return { token, expires };
  }

  async scanFinalize(user, loanId, token) {
    const loan = await this.assertLoan(loanId);
    if (loan.lender_id !== user.id) throw this.error.forbidden("Not your loan");

    const meeting = await this.db.meeting.findUnique({
      where: { loan_id: loanId },
    });
    if (!meeting || meeting.status !== "ACCEPTED")
      throw this.error.badRequest("Meeting must be ACCEPTED");
    if (!meeting.qr_token || meeting.qr_token !== token)
      throw this.error.forbidden("Invalid token");
    if (meeting.qr_expires && meeting.qr_expires.getTime() < Date.now())
      throw this.error.forbidden("Token expired");

    const pendingTransfer = await this.db.transfer.findFirst({
      where: {
        from_customer_id: loan.borrower_id,
        to_seller_id: loan.lender_id,
        status: "PENDING",
      },
      orderBy: { created_at: "desc" },
    });
    if (!pendingTransfer)
      throw this.error.notFound("Pending transfer not found");

    let lenderWallet = await this.db.wallet.findUnique({
      where: { seller_id: loan.lender_id },
    });
    if (!lenderWallet)
      lenderWallet = await this.db.wallet.create({
        data: { seller_id: loan.lender_id },
      });

    await this.db.$transaction([
      this.db.wallet.update({
        where: { id: lenderWallet.id },
        data: { balance: { increment: Number(pendingTransfer.amount) } },
      }),
      this.db.transfer.update({
        where: { id: pendingTransfer.id },
        data: { status: "COMPLETED" },
      }),
      this.db.meeting.update({
        where: { loan_id: loanId },
        data: { status: "COMPLETED", qr_token: null, qr_expires: null },
      }),
      this.db.loan.update({
        where: { id: loanId },
        data: { status: "WAITING_FOR_RETURN" },
      }),
    ]);

    const updatedLoan = await this.db.loan.findUnique({
      where: { id: loanId },
    });
    const updatedMeeting = await this.db.meeting.findUnique({
      where: { loan_id: loanId },
    });
    return { ok: true, loan: updatedLoan, meeting: updatedMeeting };
  }
}

export default new MeetingService();
