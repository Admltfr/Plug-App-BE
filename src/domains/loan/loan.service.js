import BaseService from "../../common/base_classes/base-service.js";
import Roles from "../../common/enums/user-roles.enum.js";

class LoanService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async createLoan(user, productId) {
    if (user.role !== Roles.Borrower)
      throw this.error.forbidden("Only borrower can create loan");

    const product = await this.db.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw this.error.notFound("Product not found");

    const existingOpen = await this.db.loan.findFirst({
      where: { product_id: productId, status: { in: ["PENDING", "ACCEPTED"] } },
      include: {
        product: { include: { lender: true } },
        borrower: true,
        lender: true,
      },
    });

    if (existingOpen) {
      if (existingOpen.borrower_id === user.id) return existingOpen;
      throw this.error.badRequest("Product is locked by another borrower");
    }

    const amount = Number(product.price);
    const loan = await this.db.loan.create({
      data: {
        product_id: productId,
        borrower_id: user.id,
        lender_id: product.lender_id,
        amount,
      },
      include: {
        product: { include: { lender: true } },
        borrower: true,
        lender: true,
      },
    });

    return loan;
  }

  async getBorrowerLoans(user, status) {
    if (user.role !== Roles.Borrower)
      throw this.error.forbidden("Only borrower");
    const where = { borrower_id: user.id, ...(status ? { status } : {}) };
    const loans = await this.db.loan.findMany({
      where,
      include: {
        product: { include: { lender: true } },
        borrower: true,
        lender: true,
      },
      orderBy: { created_at: "desc" },
    });
    return loans;
  }

  async confirmLoan(user, id, decision) {
    if (user.role !== Roles.Lender)
      throw this.error.forbidden("Only lender can confirm");
    const loan = await this.db.loan.findUnique({ where: { id } });
    if (!loan) throw this.error.notFound("Loan not found");
    if (loan.lender_id !== user.id)
      throw this.error.forbidden("Not your loan to confirm");
    if (loan.status !== "PENDING")
      throw this.error.badRequest("Loan is not pending");

    if (decision === "REJECT") {
      return await this.db.loan.update({
        where: { id },
        data: { status: "REJECTED" },
      });
    }

    const updated = await this.db.loan.update({
      where: { id },
      data: { status: "ACCEPTED" },
    });
    return updated; 
  }

  async getLenderLoans(user, status) {
    if (user.role !== Roles.Lender) throw this.error.forbidden("Only lender");
    const where = { lender_id: user.id, ...(status ? { status } : {}) };
    const loans = await this.db.loan.findMany({
      where,
      include: {
        product: { include: { lender: true } },
        borrower: true,
        lender: true,
      },
      orderBy: { created_at: "desc" },
    });
    return loans;
  }

  async markReturned(user, id) {
    if (user.role !== Roles.Lender) throw this.error.forbidden("Only lender");
    const loan = await this.db.loan.findUnique({ where: { id } });
    if (!loan) throw this.error.notFound("Loan not found");
    if (loan.lender_id !== user.id) throw this.error.forbidden("Not your loan");
    if (loan.status !== "WAITING_FOR_RETURN")
      throw this.error.badRequest("Loan not waiting for return");

    const updated = await this.db.loan.update({
      where: { id },
      data: { status: "COMPLETED" },
    });
    return updated;
  }
}

export default new LoanService();
