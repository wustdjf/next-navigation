import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import { ensureInitialized } from "@/utils/databaseUtils";
import configsService from "@/services/configsService";

/**
 * 获取所有配置
 * GET /api/configs
 */
export async function GET(request: NextRequest) {
  try {
    // 确保数据库已初始化
    await ensureInitialized();

    const configs = await configsService.getConfigsAsObject();
    return successResponse(configs, "获取配置成功");
  } catch (error) {
    console.error("获取配置失败:", error);

    return errorResponse(
      "获取配置失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.QUERY_ERROR
    );
  }
}

/**
 * 批量更新配置
 * POST /api/configs
 */
export async function POST(request: NextRequest) {
  try {
    // 确保数据库已初始化
    await ensureInitialized();

    // 获取请求体
    const configData = await request.json();

    if (typeof configData !== "object" || configData === null) {
      return errorResponse(
        "无效的请求数据",
        "请求体必须是对象",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // 批量更新配置
    for (const [key, value] of Object.entries(configData)) {
      if (typeof value === "string") {
        await configsService.updateConfigByKey(key, value);
      }
    }

    return successResponse(null, "更新配置成功");
  } catch (error) {
    console.error("更新配置失败:", error);

    return errorResponse(
      "更新配置失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.SERVER_ERROR
    );
  }
}
