import StoreController from "./store.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { storeSchema } from "./store.schema.js";

class StoreRoutes extends BaseRoutes {
  constructor() {
    super(StoreController);
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
      this.auth.role([this.roles.Customer]),
      this.errCatch(
        this.controller.getStoresByCustomerId.bind(this.controller),
      ),
    ]);
    this.router.get("/:id", [
      this.auth.authenticate,
      this.auth.role([this.roles.Customer]),
      this.errCatch(this.controller.getStoreById.bind(this.controller)),
    ]);
    this.router.post("/", [
      this.auth.authenticate,
      this.auth.role([this.roles.Customer]),
      this.validate(storeSchema),
      this.errCatch(this.controller.createStore.bind(this.controller)),
    ]);
  }
}

export default new StoreRoutes().router;
