// 定义错误码枚举
export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  CONFLICT = "CONFLICT",
  QUERY_ERROR = "QUERY_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
}

// 成功响应
export const successResponse = (data: any, message = "操作成功", meta = {}) => {
  return Response.json({
    success: true,
    message,
    data,
    meta,
  });
};

// 错误响应
export const errorResponse = (
  message: string,
  error: string,
  status = 500,
  code = ErrorCode.SERVER_ERROR
) => {
  return Response.json(
    {
      success: false,
      message,
      error,
      code,
    },
    { status }
  );
};
