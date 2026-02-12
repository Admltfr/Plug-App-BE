import jwt from "jsonwebtoken";
import BaseError from "../common/base_classes/base-error.js";
import Prisma from "../common/services/prisma.service.js";
import logger from "../utils/logger.util.js";
import Roles from "../common/enums/user-roles.enum.js";

class AuthMiddleware {
  constructor() {
    this.roles = Roles;
    this.prisma = Prisma;
  }

  authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Token not found in request headers");
      return next(BaseError.unauthorized("Token not found"));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      logger.warn("No token provided");
      return next(BaseError.unauthorized("User Have Not Login"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (
        !decoded ||
        !decoded.id ||
        !decoded.role ||
        !(
          decoded.role === this.roles.Borrower ||
          decoded.role === this.roles.Lender
        )
      ) {
        logger.warn("Decoded token is invalid or missing required fields");
        return next(BaseError.forbidden("Token Is Invalid Or No Longer Valid"));
      }

      if (decoded.role === this.roles.Lender) {
        const lender = await this.prisma.lender.findUnique({
          where: { id: decoded.id },
        });

        if (!lender) {
          logger.warn(`Lender with ID ${decoded.id} not found in database`);
          return next(BaseError.notFound("Lender Not Found"));
        }

        req.user = lender;
        req.user.role = this.roles.Lender;
      } else if (decoded.role === this.roles.Borrower) {
        const borrower = await this.prisma.borrower.findUnique({
          where: { id: decoded.id },
        });

        if (!borrower) {
          logger.warn(`Borrower with ID ${decoded.id} not found in database`);
          return next(BaseError.notFound("Borrower Not Found"));
        }
        
        req.user = borrower;
        req.user.role = this.roles.Borrower;
      } else {
        logger.warn("Token type is invalid");
        return next(BaseError.forbidden("Token Is Invalid Or No Longer Valid"));
      }

      next();
    } catch (err) {
      if (err.message === "invalid signature") {
        return next(BaseError.forbidden("Invalid Signature"));
      } else if (err.message === "invalid token") {
        return next(BaseError.forbidden("Invalid Token"));
      } else if (err.message === "jwt expired") {
        return next(BaseError.forbidden("Token Expired"));
      } else {
        return next(BaseError.forbidden("Token Is Invalid Or No Longer Valid"));
      }
    }
  };

  role = (roles) => {
    return (req, res, next) => {
      if (req.user.role === this.roles.Admin) {
        logger.info(`Welkam Atmind`);
        return next();
      }

      if (!roles.includes(req.user.role)) {
        logger.warn(`User role ${req.user.role} does not have access`);
        return next(BaseError.forbidden("Access Denied"));
      }
      next();
    };
  };
}

export default new AuthMiddleware();
