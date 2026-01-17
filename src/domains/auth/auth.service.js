import BaseService from "../../common/base_classes/base-service.js";
import {
  hashPassword,
  matchPassword,
  generateToken,
} from "../../utils/auth.util.js";
import Roles from "../../common/enums/user-roles.enum.js";

class AuthService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async login(info) {
    const { email, password } = info;

    let user = await this.db.customer.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.db.seller.findUnique({
        where: { email },
      });
    }

    if (!user) {
      throw this.error.notFound("Email not found");
    }

    const isMatch = await matchPassword(password, user.password);

    if (!isMatch) {
      throw this.error.unauthorized("Invalid password");
    }

    const Role = user.role === Roles.Seller ? Roles.Seller : Roles.Customer;

    const accessToken = generateToken({ id: user.id, role: Role });

    delete user.password;

    const data = { user, accessToken };

    return data;
  }

  async register(info) {
    const { name, email, password, role } = info;
    var newUser, user;
    if (role === Roles.Customer) {
      user = await this.db.customer.findUnique({
        where: { email },
      });

      newUser = await this.db.customer.create({
        data: {
          name,
          email,
          password: await hashPassword(password),
        },
      });
    } else if (role === Roles.Seller) {
      user = await this.db.seller.findUnique({
        where: { email },
      });

      newUser = await this.db.seller.create({
        data: {
          name,
          email,
          password: await hashPassword(password),
        },
      });
    } else {
      throw this.error.badRequest("Invalid role specified");
    }

    delete newUser.password;

    const data = { newUser };

    return data;
  }
}

export default new AuthService();
