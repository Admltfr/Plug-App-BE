import "dotenv/config";
import morgan from "morgan";
import express from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import routes from "./routes.js";
import BaseError from "./common/base_classes/base-error.js";
import logger from "./utils/logger.util.js";
import path from "path";

class ExpressApplication {
  constructor(port) {
    this.port = port;
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes(routes);
    this.setupErrorHandler();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan("tiny"));
  }

  setupRoutes(routes) {
    this.app.use(
      "/images",
      express.static(path.join(process.cwd(), "public", "images"))
    );

    const router = express.Router();

    routes.forEach((route) => {
      router.use(`/api${route.path}`, route.route);
    });

    this.app.use(router);

    this.app.use("*splat", (req, res, next) => {
      logger.error(`Route not found: ${req.originalUrl}`);
      next(BaseError.notFound("Route not found"));
    });
  }

  setupErrorHandler() {
    this.app.use(errorMiddleware.errorHandler);
  }

  start() {
    this.app.listen(this.port, () => {
      logger.info(`Server is running on port ${this.port}`);
    });
  }
}

export default ExpressApplication;
