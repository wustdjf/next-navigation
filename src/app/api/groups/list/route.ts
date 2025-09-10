import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import groupsService from "@/services/groupsService";

/**
 * 获取分组列表
 * GET /api/groups/list
 */
export async function GET(request: NextRequest) {
  try {
    // 从URL中获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const {
      name,
      type,
      pageNum = "1",
      pageSize = "10",
      isHot,
    } = Object.fromEntries(searchParams.entries());

    // 调用服务获取产品列表
    const result = await groupsService.getGroups({
      name,
      type,
      pageNum: Number(pageNum),
      pageSize: Number(pageSize),
      isHot: isHot === "true",
    });

    // 返回成功响应
    return successResponse(result.data, "获取分组列表成功", {
      total: result.total,
      pageNum: result.pageNum,
      pageSize: result.pageSize,
      totalPages: Math.ceil(result.total / result.pageSize),
    });
  } catch (error) {
    // 记录错误
    console.error("获取分组列表失败:", error);

    // 返回错误响应
    return errorResponse(
      "获取分组列表失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.QUERY_ERROR
    );
  }
}
