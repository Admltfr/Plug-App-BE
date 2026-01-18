import WarehouseService from "./warehouse.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class WarehouseController extends BaseController {
  constructor() {
    super(WarehouseService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = WarehouseService
  }

  async getAllWarehouseBySellerId(req, res) {
    const id = req.query.seller_id;
    const data = await this.service.getAllWarehouseBySellerId(id);
    return this.response.success(
      res,
      data.data,
      "Warehouses fetched",
      data.pagination,
    );
  }

  async getWarehouseById(req, res) {
    const id = req.params.id;
    const data = await this.service.getWarehouseById(id);
    return this.response.success(res, data, "Warehouse fetched");
  }
}

export default new WarehouseController();
