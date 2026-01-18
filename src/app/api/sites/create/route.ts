import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import { ensureInitialized } from "@/utils/databaseUtils";
import sitesService from "@/services/sitesService";

/**
 * 创建站点
 * POST /api/sites/create
 */
export async function POST(request: NextRequest) {
  try {
    // 确保数据库已初始化
    await ensureInitialized();

    // 获取请求体
    const siteData = await request.json();

    // 创建新站点
    const newSite = await sitesService.createSite(siteData);

    return successResponse(newSite, "创建站点成功");
  } catch (error) {
    console.error("创建站点失败:", error);

    // 判断是否是验证错误
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    const isValidationError = errorMessage.includes("验证错误");

    return errorResponse(
      "创建站点失败",
      errorMessage,
      isValidationError ? 400 : 500,
      isValidationError ? ErrorCode.VALIDATION_ERROR : ErrorCode.SERVER_ERROR
    );
  }
}
