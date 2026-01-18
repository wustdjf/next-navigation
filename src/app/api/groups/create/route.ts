import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import { verifyTokenFromRequest, createUnauthorizedResponse } from "@/utils/authMiddleware";
import { ensureInitialized } from "@/utils/databaseUtils";
import groupsService from "@/services/groupsService";

/**
 * 创建分组
 * POST /api/groups/create
 */
export async function POST(request: NextRequest) {
  try {
    // 验证token
    const userId = verifyTokenFromRequest(request);
    if (!userId) {
      return createUnauthorizedResponse("Token无效或已过期");
    }

    // 获取请求体
    const groupData = await request.json();
    console.log("📝 收到创建分组请求:", groupData);

    // 确保数据库已初始化
    await ensureInitialized();

    // 创建新分组
    const newGroup = await groupsService.createGroup(groupData);
    console.log("✅ 分组创建成功:", newGroup);

    return successResponse(newGroup, "创建分组成功");
  } catch (error) {
    console.error("❌ 创建分组失败:", error);
    console.error("错误详情:", {
      message: error instanceof Error ? error.message : "未知错误",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });

    // 判断是否是验证错误
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    const isValidationError = errorMessage.includes("验证错误");

    return errorResponse(
      "创建分组失败",
      errorMessage,
      isValidationError ? 400 : 500,
      isValidationError ? ErrorCode.VALIDATION_ERROR : ErrorCode.SERVER_ERROR
    );
  }
}
