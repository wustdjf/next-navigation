import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import userService from "@/services/userService";

/**
 * 获取用户详情
 * GET /api/user/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (typeof id !== "string") {
      return errorResponse(
        "无效的用户ID",
        "用户ID必须是数字字符串",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    const user = await userService.findUserById(id);

    if (!user) {
      return errorResponse(
        "用户不存在",
        `找不到ID为 ${id} 的用户`,
        404,
        ErrorCode.NOT_FOUND
      );
    }

    return successResponse(user, "查询用户详情成功");
  } catch (error) {
    console.error(`查询用户详情失败:`, error);

    return errorResponse(
      "查询用户详情失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.QUERY_ERROR
    );
  }
}

/**
 * 更新用户
 * PUT /api/user/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (typeof id !== "string") {
      return errorResponse(
        "无效的用户ID",
        "用户ID必须是数字字符串",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // 获取请求体
    const userData = await request.json();

    // 更新用户
    const updateUser = await userService.updateUserById(id, userData);

    if (!updateUser) {
      return errorResponse(
        "用户不存在",
        `找不到ID为 ${id} 的用户`,
        404,
        ErrorCode.NOT_FOUND
      );
    }

    return successResponse(updateUser, "更新用户成功");
  } catch (error) {
    console.error(`更新用户失败:`, error);

    return errorResponse(
      "更新用户失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.SERVER_ERROR
    );
  }
}

/**
 * 删除用户
 * DELETE /api/user/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (typeof id !== "string") {
      return errorResponse(
        "无效的用户ID",
        "用户ID必须是数字字符串",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // 删除用户
    const success = await userService.deleteUserById(id);

    if (!success) {
      return errorResponse(
        "用户不存在",
        `找不到ID为 ${id} 的用户`,
        404,
        ErrorCode.NOT_FOUND
      );
    }

    return successResponse(null, "删除用户成功");
  } catch (error) {
    console.error(`删除用户失败:`, error);

    return errorResponse(
      "删除用户失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.SERVER_ERROR
    );
  }
}
