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

    let user = await this.db.borrower.findUnique({ where: { email } });
    let Role = Roles.Borrower;

    if (!user) {
      user = await this.db.lender.findUnique({ where: { email } });
      Role = Roles.Lender;
    }

    if (!user) throw this.error.notFound("Email not found");

    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) throw this.error.unauthorized("Invalid password");

    const accessToken = generateToken({ id: user.id, role: Role });
    delete user.password;

    return { user, accessToken };
  }

  async register(info) {
    const { name, email, password, role } = info;
    let newUser, existing;

    if (role === Roles.Borrower) {
      existing = await this.db.borrower.findUnique({ where: { email } });

      if (existing) throw this.error.badRequest("Email already registered");

      newUser = await this.db.borrower.create({
        data: { name, email, password: await hashPassword(password) },
      });
    } else if (role === Roles.Lender) {
      existing = await this.db.lender.findUnique({ where: { email } });

      if (existing) throw this.error.badRequest("Email already registered");

      newUser = await this.db.lender.create({
        data: { name, email, password: await hashPassword(password) },
      });
    } else {
      throw this.error.badRequest("Invalid role specified");
    }

    delete newUser.password;
    return { newUser };
  }
}

export default new AuthService();
