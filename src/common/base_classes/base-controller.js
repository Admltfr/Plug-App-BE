import BaseError from "./base-error.js";
import BaseResponse from "./base-response.js";

class BaseController {
  constructor(service) {
    this.response = BaseResponse;
    this.error = BaseError;
    this.service = service;
  }
}

export default BaseController;
