import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import { ensureInitialized } from "@/utils/databaseUtils";
import dataService from "@/services/dataService";

/**
 * 导入数据
 * POST /api/data/import
 */
export async function POST(request: NextRequest) {
  try {
    // 确保数据库已初始化
    await ensureInitialized();

    // 获取请求体
    const importData = await request.json();

    if (!importData || typeof importData !== "object") {
      return errorResponse(
        "无效的请求数据",
        "请求体必须是对象",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // 导入数据
    const result = await dataService.importData(importData);

    return successResponse(result, "数据导入成功");
  } catch (error) {
    console.error("导入数据失败:", error);

    return errorResponse(
      "导入数据失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.SERVER_ERROR
    );
  }
}
