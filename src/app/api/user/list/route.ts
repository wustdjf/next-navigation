import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import userService from "@/services/userService";

/**
 * 获取用户列表
 * GET /api/users/list
 */
export async function GET(request: NextRequest) {
  try {
    // 调用服务获取用户列表
    const result = await userService.findAllUsers();

    // 返回成功响应
    return successResponse(result, "获取用户列表成功");
  } catch (error) {
    // 记录错误
    console.error("获取用户列表失败:", error);

    // 返回错误响应
    return errorResponse(
      "获取用户列表失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.QUERY_ERROR
    );
  }
}
