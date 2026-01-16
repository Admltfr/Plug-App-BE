import Prisma from "../services/prisma.service.js";
import logger from "../../utils/logger.util.js";

class BaseSeeder {
  constructor() {
    this.db = Prisma;
    this.log = logger;
  }

  static async run(seedFn) {
    try {
      await seedFn();
      logger.info(`Seeding on ${seedFn.name} finished successfully.`);
    } catch (err) {
      logger.error(`Seeding failed on ${seedFn.name}:`, err);
      process.exit(1);
    }
  }
}

export default BaseSeeder;
