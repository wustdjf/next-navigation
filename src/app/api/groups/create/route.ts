import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import groupsService from "@/services/groupsService";

/**
 * 创建分组
 * POST /api/groups/create
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const groupData = await request.json();

    // 创建新分组
    const newGroup = await groupsService.createGroup(groupData);

    return successResponse(newGroup, "创建分组成功");
  } catch (error) {
    console.error("创建分组失败:", error);

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
