import WarehouseController from "./warehouse.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { warehouseSchema } from "./warehouse.schema.js";

class WarehouseRoutes extends BaseRoutes {
  constructor() {
    super(WarehouseController);
    //this.router = Router();
    //this.auth = AuthMiddleware;
    //this.validate = Validate;
    //this.errCatch = ErrorMiddleware.errorCatcher;
    //this.controller = controller;
    //this.roles = Roles;
    //this.routes();
  }

  routes() {
    this.router.get("/", [
      this.auth.authenticate,
      this.auth.role([this.roles.Seller]),
      this.errCatch(
        this.controller.getAllWarehouseBySellerId.bind(this.controller),
      ),
    ]);

    this.router.get("/:id", [
      this.auth.authenticate,
      this.errCatch(this.controller.getWarehouseById.bind(this.controller)),
    ]);
  }
}

export default new WarehouseRoutes().router;
