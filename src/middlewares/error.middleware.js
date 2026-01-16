import StatusCode from "../common/enums/status-codes.enum.js";
import BaseError from "../common/base_classes/base-error.js";
import logger from "../utils/logger.util.js";

class ErrorMiddleware {
  errorHandler = (err, req, res, next) => {
    if (err instanceof BaseError) {
      logger.error(err.message);
      return res.status(err.errorCode).json({
        success: false,
        status: err.errorName,
        message: err.message,
      });
    } else {
      logger.error("Unhandled error:", err);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR.code).json({
        success: false,
        status: "Internal Server Error",
        message: err.message || StatusCode.INTERNAL_SERVER_ERROR.message,
      });
    }
  };

  errorCatcher = (controller) => async (req, res, next) => {
    try {
      await controller(req, res);
    } catch (err) {
      const name = controller.name?.replace(/^bound\s*/, ""); // buat ilangin kata kata "bound" soalnya di controller pake bind biar context "this"nya tetap dapet
      logger.error(`in [${name}]:`, err);
      next(err);
    }
  };
}

export default new ErrorMiddleware();
