import StatusCodes from "../enums/status-codes.enum.js";

class BaseResponse {
  static success(
    res,
    data,
    message = StatusCodes.OK.message,
    pagination = null
  ) {
    return res.status(StatusCodes.OK.code).json({
      success: true,
      status: StatusCodes.OK.codeName,
      message: message,
      pagination: pagination,
      data,
    });
  }

  static created(res, data, message = StatusCodes.CREATED.message) {
    return res.status(StatusCodes.CREATED.code).json({
      success: true,
      status: StatusCodes.CREATED.codeName,
      message: message,
      data,
    });
  }
}

export default BaseResponse;
