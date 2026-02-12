import PaymentController from "./payment.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { topupSchema, paySchema } from "./payment.schema.js";

class PaymentRoutes extends BaseRoutes {
  constructor() {
    super(PaymentController);
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
      "/balance",
      this.auth.authenticate,
      this.errCatch(this.controller.getWalletBalance.bind(this.controller)),
    );

    this.router.post(
      "/topup",
      this.auth.authenticate,
      this.auth.role([this.roles.Borrower]),
      this.validate(topupSchema),
      this.errCatch(this.controller.createTopup.bind(this.controller)),
    );

    this.router.post(
      "/webhook",
      this.errCatch(this.controller.handleWebhook.bind(this.controller)),
    );

    this.router.post(
      "/pay",
      this.auth.authenticate,
      this.auth.role([this.roles.Borrower]),
      this.validate(paySchema),
      this.errCatch(this.controller.payWithBalance.bind(this.controller)),
    );
  }
}

export default new PaymentRoutes().router;
