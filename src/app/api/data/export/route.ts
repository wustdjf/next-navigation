import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import dataService from "@/services/dataService";

/**
 * 导出数据
 * GET /api/data/export
 */
export async function GET(request: NextRequest) {
  try {
    // 导出数据
    const data = await dataService.exportData();

    return successResponse(data, "数据导出成功");
  } catch (error) {
    console.error("导出数据失败:", error);

    return errorResponse(
      "导出数据失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.SERVER_ERROR
    );
  }
}
