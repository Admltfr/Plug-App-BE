import { Router } from "express";
import AuthMiddleware from "../../middlewares/auth.middleware.js";
import Validate from "../../middlewares/request-validator.middleware.js";
import ErrorMiddleware from "../../middlewares/error.middleware.js";
import Roles from "../../common/enums/user-roles.enum.js";

class BaseRoutes {
  constructor(controller) {
    this.router = Router();
    this.auth = AuthMiddleware;
    this.validate = Validate;
    this.errCatch = ErrorMiddleware.errorCatcher;
    this.controller = controller;
    this.roles = Roles;
    this.routes();
  }

  routes() {
    throw new Error("Routes method must be implemented in child classes.");
  }
}

export default BaseRoutes;
