import BaseError from "./base-error.js";
import Prisma from "../services/prisma.service.js";

class BaseService {
  constructor() {
    this.error = BaseError;
    this.db = Prisma;
  }
}
export default BaseService;
