import LoanController from "./loan.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { createLoanSchema, confirmLoanSchema } from "./loan.schema.js";

class LoanRoutes extends BaseRoutes {
  constructor() {
    super(LoanController);
    //this.router = Router();
    //this.auth = AuthMiddleware;
    //this.validate = Validate;
    //this.errCatch = ErrorMiddleware.errorCatcher;
    //this.controller = controller;
    //this.roles = Roles;
    //this.routes();
  }

  routes() {
    this.router.post(
      "/",
      this.auth.authenticate,
      this.auth.role([this.roles.Customer]),
      this.validate(createLoanSchema),
      this.errCatch(this.controller.createLoan.bind(this.controller)),
    );

    this.router.patch(
      "/:id/confirm",
      this.auth.authenticate,
      this.auth.role([this.roles.Seller]),
      this.validate(confirmLoanSchema),
      this.errCatch(this.controller.confirmLoan.bind(this.controller)),
    );

    this.router.get(
      "/lender",
      this.auth.authenticate,
      this.auth.role([this.roles.Seller]),
      this.errCatch(this.controller.getLenderLoans.bind(this.controller)),
    );

    this.router.get(
      "/",
      this.auth.authenticate,
      this.auth.role([this.roles.Customer]),
      this.errCatch(this.controller.getBorrowerLoans.bind(this.controller)),
    );
  }
}

export default new LoanRoutes().router;
