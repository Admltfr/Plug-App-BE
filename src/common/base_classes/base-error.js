import StatusCodes from "../enums/status-codes.enum.js";

class BaseError extends Error {
  constructor(errorCode, statusCode, errorName, message) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errorName = errorName;
  }

  static notFound(message = StatusCodes.NOT_FOUND.codeName) {
    return new BaseError(
      StatusCodes.NOT_FOUND.code,
      StatusCodes.NOT_FOUND.message,
      StatusCodes.NOT_FOUND.codeName,
      message
    );
  }

  static badRequest(message = StatusCodes.BAD_REQUEST.codeName) {
    return new BaseError(
      StatusCodes.BAD_REQUEST.code,
      StatusCodes.BAD_REQUEST.message,
      StatusCodes.BAD_REQUEST.codeName,
      message
    );
  }

  static unauthorized(message = StatusCodes.UNAUTHORIZED.codeName) {
    return new BaseError(
      StatusCodes.UNAUTHORIZED.code,
      StatusCodes.UNAUTHORIZED.message,
      StatusCodes.UNAUTHORIZED.codeName,
      message
    );
  }

  static forbidden(message = StatusCodes.FORBIDDEN.codeName) {
    return new BaseError(
      StatusCodes.FORBIDDEN.code,
      StatusCodes.FORBIDDEN.message,
      StatusCodes.FORBIDDEN.codeName,
      message
    );
  }

  static unprocessable(message = StatusCodes.UNPROCESSABLE_ENTITY.codeName) {
    return new BaseError(
      StatusCodes.UNPROCESSABLE_ENTITY.code,
      StatusCodes.UNPROCESSABLE_ENTITY.message,
      StatusCodes.UNPROCESSABLE_ENTITY.codeName,
      message
    );
  }

}

export default BaseError;
