import PaymentService from "./payment.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class PaymentController extends BaseController {
  constructor() {
    super(PaymentService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = PaymentService
  }

  async createTopup(req, res) {
    const { amount } = req.body;
    const data = await this.service.createTopup(req.user, amount);
    return this.response.created(res, data, "Topup initiated");
  }

  async handleWebhook(req, res) {
    await this.service.handleWebhook(req.body);
    return this.response.success(res, { ok: true }, "Webhook processed");
  }

  async payWithBalance(req, res) {
    const { loanId } = req.body;
    const data = await this.service.payWithBalance(req.user, loanId);
    return this.response.success(res, data, "Payment completed");
  }

  async getWalletBalance(req, res) {
    const data = await this.service.getWalletBalance(req.user);
    return this.response.success(res, data, "Wallet fetched");
  }
}

export default new PaymentController();
