import ProductService from "./product.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class ProductController extends BaseController {
  constructor() {
    super(ProductService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = ProductService
  }

  async getAllProduct(req, res) {
    const query = req.query;
    const data = await this.service.getAllProduct(query);
    return this.response.success(
      res,
      data.data,
      "Products fetched",
      data.pagination,
    );
  }

  async getProductById(req, res) {
    const id = req.params.id;
    const data = await this.service.getProductById(id);
    return this.response.success(res, data, "Product fetched");
  }
}

export default new ProductController();
