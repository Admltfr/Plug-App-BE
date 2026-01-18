import StoreService from "./store.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class StoreController extends BaseController {
  constructor() {
    super(StoreService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = StoreService
  }

  async createStore(req, res) {
    const data = await this.service.createStore(req.body);
    return this.response.created(res, data, "Store created");
  }

  async getStoresByCustomerId(req, res) {
    const id = req.user?.id;
    const data = await this.service.getStoresByCustomerId(id);
    return this.response.success(
      res,
      data.data,
      "Stores fetched",
      data.pagination,
    );
  }

  async getStoreById(req, res) {
    const id = req.params.id;
    const data = await this.service.getStoreById(id);
    return this.response.success(res, data, "Store fetched");
  }
}
export default new StoreController();
