import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import groupsService from "@/services/groupsService";

/**
 * 获取全部分组
 * GET /api/groups/all
 */
export async function GET(request: NextRequest) {
  try {
    // 调用服务获取产品列表
    const result = await groupsService.findAllGroups();

    // 返回成功响应
    return successResponse(result, "获取全部分组");
  } catch (error) {
    // 记录错误
    console.error("获取全部分组失败:", error);

    // 返回错误响应
    return errorResponse(
      "获取全部分组失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.QUERY_ERROR
    );
  }
}
