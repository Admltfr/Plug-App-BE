import AuthService from "./auth.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class AuthController extends BaseController {
  constructor() {
    super(AuthService);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = AuthService
  }

  async login(req, res) {
    const info = req.body;
    const data = await this.service.login(info);

    return this.response.success(res, data, "Login Successful");
  }

  async register(req, res) {
    const info = req.body;
    const data = await this.service.register(info);

    return this.response.created(res, data, "Registration Successful");
  }
}

export default new AuthController();
