import ProductController from "./product.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { productSchema } from "./product.schema.js";

class ProductRoutes extends BaseRoutes {
  constructor() {
    super(ProductController);
    //this.router = Router();
    //this.auth = AuthMiddleware;
    //this.validate = Validate;
    //this.errCatch = ErrorMiddleware.errorCatcher;
    //this.controller = controller;
    //this.roles = Roles;
    //this.routes();
  }
  routes() {
    this.router.get(
      "/",
      this.errCatch(this.controller.getAllProduct.bind(this.controller)),
    );
    this.router.get(
      "/:id",
      this.errCatch(this.controller.getProductById.bind(this.controller)),
    );
  }
}

export default new ProductRoutes().router;
