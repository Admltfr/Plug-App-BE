import { PrismaClient } from "@prisma/client";
import logger from "../../utils/logger.util.js";

const Prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

Prisma.$on("query", (e) => {
  logger.info("Query: " + e.query);
  logger.info("Params: " + e.params);
  logger.info("Duration: " + e.duration + "ms");
});

export default Prisma;
