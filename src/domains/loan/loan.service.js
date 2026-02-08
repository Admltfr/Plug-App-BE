import BaseService from "../../common/base_classes/base-service.js";
import Roles from "../../common/enums/user-roles.enum.js";

class LoanService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async createLoan(user, productId) {
    if (user.role !== Roles.Customer)
      throw this.error.forbidden("Only borrower can create loan");
    const product = await this.db.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw this.error.notFound("Product not found");

    const existingOpen = await this.db.loan.findFirst({
      where: {
        product_id: productId,
        status: { in: ["PENDING", "ACCEPTED"] },
      },
      include: {
        product: { include: { seller: true } },
        customer: true,
        seller: true,
      },
    });

    if (existingOpen) {
      if (existingOpen.borrower_id === user.id) {
        return existingOpen;
      }
      throw this.error.badRequest("Product is locked by another borrower");
    }

    const amount = Number(product.price);
    const loan = await this.db.loan.create({
      data: {
        product_id: productId,
        borrower_id: user.id,
        lender_id: product.seller_id,
        amount,
      },
      include: {
        product: { include: { seller: true } },
        customer: true,
        seller: true,
      },
    });

    return loan;
  }

  async getBorrowerLoans(user, status) {
    if (user.role !== Roles.Customer)
      throw this.error.forbidden("Only borrower");
    const where = { borrower_id: user.id, ...(status ? { status } : {}) };
    const loans = await this.db.loan.findMany({
      where,
      include: {
        product: { include: { seller: true } },
        customer: true,
        seller: true,
      },
      orderBy: { created_at: "desc" },
    });
    return loans;
  }

  async confirmLoan(user, id, decision) {
    if (user.role !== Roles.Seller)
      throw this.error.forbidden("Only lender can confirm");
    const loan = await this.db.loan.findUnique({ where: { id } });
    if (!loan) throw this.error.notFound("Loan not found");
    if (loan.lender_id !== user.id)
      throw this.error.forbidden("Not your loan to confirm");
    if (loan.status !== "PENDING")
      throw this.error.badRequest("Loan is not pending");

    if (decision === "REJECT") {
      const updated = await this.db.loan.update({
        where: { id },
        data: { status: "REJECTED" },
      });
      return updated;
    }

    const updated = await this.db.loan.update({
      where: { id },
      data: { status: "ACCEPTED" },
    });

    let room = await this.db.chatRoom.findFirst({
      where: { customer_id: loan.borrower_id, seller_id: loan.lender_id },
    });
    if (!room) {
      room = await this.db.chatRoom.create({
        data: { customer_id: loan.borrower_id, seller_id: loan.lender_id },
      });
    }

    return { ...updated, roomId: room.id };
  }

  async getLenderLoans(user, status) {
    if (user.role !== Roles.Seller) throw this.error.forbidden("Only lender");
    const where = { lender_id: user.id, ...(status ? { status } : {}) };
    const loans = await this.db.loan.findMany({
      where,
      include: {
        product: { include: { seller: true } },
        customer: true,
        seller: true,
      },
      orderBy: { created_at: "desc" },
    });
    return loans;
  }
}

export default new LoanService();
