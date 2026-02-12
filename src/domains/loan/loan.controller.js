import LoanService from "./loan.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class LoanController extends BaseController {
  constructor() {
    super(LoanService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = LoanService
  }

  async createLoan(req, res) {
    const { productId } = req.body;
    const data = await this.service.createLoan(req.user, productId);
    return this.response.created(res, data, "Loan created");
  }

  async confirmLoan(req, res) {
    const { decision } = req.body;
    const data = await this.service.confirmLoan(
      req.user,
      req.params.id,
      decision,
    );
    return this.response.success(res, data, "Loan confirmation updated");
  }

  async getLenderLoans(req, res) {
    const { status } = req.query;
    const data = await this.service.getLenderLoans(req.user, status);
    return this.response.success(res, data, "Lender loans fetched");
  }

  async getBorrowerLoans(req, res) {
    const { status } = req.query;
    const data = await this.service.getBorrowerLoans(req.user, status);
    return this.response.success(res, data, "Borrower loans fetched");
  }

  async markReturned(req, res) {
    const data = await this.service.markReturned(req.user, req.params.id);
    return this.response.success(res, data, "Loan marked as returned");
  }
}

export default new LoanController();
