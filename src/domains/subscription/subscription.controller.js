import SubscriptionService from "./subscription.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class SubscriptionController extends BaseController {
  constructor() {
    super(SubscriptionService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = SubscriptionService
  }

  async createSubscription(req, res) {
    const data = await this.service.createSubscription(req.body);
    return this.response.created(res, data, "Subscription created");
  }

  async approveSubscription(req, res) {
    const sellerId = req.user?.id;
    const data = await this.service.approveSubscription(
      req.params.id,
      sellerId,
    );
    return this.response.success(res, data, "Subscription approved");
  }

  async getSubscriptionByCustomerId(req, res) {
    const id = req.user?.id;
    const data = await this.service.getSubscriptionByCustomerId(id);
    return this.response.success(
      res,
      data.data,
      "Subscriptions fetched",
      data.pagination,
    );
  }

  async getSubscriptionBySellerId(req, res) {
    const id = req.user?.id;
    const data = await this.service.getSubscriptionBySellerId(id);
    return this.response.success(
      res,
      data.data,
      "Subscriptions fetched",
      data.pagination,
    );
  }
}

export default new SubscriptionController();
