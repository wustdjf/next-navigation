import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import userService from "@/services/userService";

/**
 * 注册用户
 * POST /api/user/create
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const userData = await request.json();

    // 创建新用户
    const newUser = await userService.createUser(userData);

    return successResponse(newUser, "注册用户成功");
  } catch (error) {
    console.error("注册用户失败:", error);

    // 判断是否是验证错误
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    const isValidationError = errorMessage.includes("验证错误");

    return errorResponse(
      "注册用户失败",
      errorMessage,
      isValidationError ? 400 : 500,
      isValidationError ? ErrorCode.VALIDATION_ERROR : ErrorCode.SERVER_ERROR
    );
  }
}
