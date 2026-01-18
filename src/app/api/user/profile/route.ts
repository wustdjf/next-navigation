import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import { verifyTokenFromRequest, createUnauthorizedResponse } from "@/utils/authMiddleware";
import { ensureInitialized } from "@/utils/databaseUtils";
import userService from "@/services/userService";

/**
 * 更新用户资料
 * PUT /api/user/profile
 */
export async function PUT(request: NextRequest) {
  try {
    // 验证token
    const userId = verifyTokenFromRequest(request);
    if (!userId) {
      return createUnauthorizedResponse("Token无效或已过期");
    }

    // 确保数据库已初始化
    await ensureInitialized();

    // 获取请求体
    const updateData = await request.json();
    console.log("📝 收到更新用户资料请求:", { userId, updateData });

    // 更新用户信息
    const updatedUser = await userService.updateUserById(userId, updateData);

    if (!updatedUser) {
      return errorResponse(
        "更新用户资料失败",
        "用户不存在",
        404,
        ErrorCode.NOT_FOUND
      );
    }

    console.log("✅ 用户资料更新成功:", updatedUser.id);

    return successResponse(updatedUser, "用户资料已更新");
  } catch (error) {
    console.error("❌ 更新用户资料失败:", error);
    console.error("错误详情:", {
      message: error instanceof Error ? error.message : "未知错误",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return errorResponse(
      "更新用户资料失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.SERVER_ERROR
    );
  }
}
