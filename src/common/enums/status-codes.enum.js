const StatusCode = Object.freeze({
  OK: {
    code: 200,
    codeName: "OK",
    message: "OK",
  },
  CREATED: {
    code: 201,
    codeName: "CREATED",
    message: "Created",
  },
  BAD_REQUEST: {
    code: 400,
    codeName: "BAD_REQUEST",
    message: "Bad Request",
  },
  UNAUTHORIZED: {
    code: 401,
    codeName: "UNAUTHORIZED",
    message: "User Unauthorized",
  },
  FORBIDDEN: {
    code: 403,
    codeName: "FORBIDDEN",
    message: "No Access",
  },
  NOT_FOUND: {
    code: 404,
    codeName: "NOT_FOUND",
    message: "Not Found",
  },
  DUPLICATE: {
    code: 450,
    codeName: "DUPLICATE",
    message: "Duplicate Found",
  },
  INVALID_PARAMS: {
    code: 477,
    codeName: "INVALID_PARAMS",
    message: "Params Format Not Registered In Application",
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    codeName: "INTERNAL_SERVER_ERROR",
    message: "Internal Server Error",
  },
  BAD_GATEWAY: {
    code: 502,
    codeName: "BAD_GATEWAY",
    message: "Bad Gateway",
  },
  SERVICE_UNAVAILABLE: {
    code: 503,
    codeName: "SERVICE_UNAVAILABLE",
    message: "Service Unavailable",
  },
  UNPROCESSABLE_ENTITY: {
    code: 422,
    codeName: "UNPROCESSABLE_ENTITY",
    message: "Unprocessable Entity",
  },
});

export default StatusCode;
