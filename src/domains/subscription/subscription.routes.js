import SubscriptionController from "./subscription.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { subscriptionCreateSchema } from "./subscription.schema.js";

class SubscriptionRoutes extends BaseRoutes {
  constructor() {
    super(SubscriptionController);
    //this.router = Router();
    //this.auth = AuthMiddleware;
    //this.validate = Validate;
    //this.errCatch = ErrorMiddleware.errorCatcher;
    //this.controller = controller;
    //this.roles = Roles;
    //this.routes();
  }

  routes() {
    this.router.post("/", [
      this.auth.authenticate,
      this.auth.role([this.roles.Customer]),
      this.validate(subscriptionCreateSchema),
      this.errCatch(this.controller.createSubscription.bind(this.controller)),
    ]);

    this.router.get("/customer", [
      this.auth.authenticate,
      this.auth.role([this.roles.Customer]),
      this.errCatch(
        this.controller.getSubscriptionByCustomerId.bind(this.controller),
      ),
    ]);

    this.router.get("/seller", [
      this.auth.authenticate,
      this.auth.role([this.roles.Seller]),
      this.errCatch(
        this.controller.getSubscriptionBySellerId.bind(this.controller),
      ),
    ]);

    this.router.patch("/:id/approve", [
      this.auth.authenticate,
      this.auth.role([this.roles.Seller]),
      this.errCatch(this.controller.approveSubscription.bind(this.controller)),
    ]);
  }
}

export default new SubscriptionRoutes().router;
