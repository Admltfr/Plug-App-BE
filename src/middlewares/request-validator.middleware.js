import BaseError from "../common/base_classes/base-error.js";
import logger from "../utils/logger.util.js";

const validate = (schema) => (req, res, next) => {
  const validated = schema.validate(req.body, {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
    convert: true,
  });

  if (validated.error) {
    const message = validated.error.details
      .map((detail) => detail.message)
      .join(", ");
    logger.warn(`Request invalid: ${message}`);
    return next(BaseError.unprocessable(message));
  }
  next();
};

export default validate;
