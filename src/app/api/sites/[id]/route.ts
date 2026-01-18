import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import { ensureInitialized } from "@/utils/databaseUtils";
import sitesService from "@/services/sitesService";

/**
 * 获取站点详情
 * GET /api/sites/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 确保数据库已初始化
    await ensureInitialized();

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return errorResponse(
        "无效的站点ID",
        "站点ID必须是数字",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    const site = await sitesService.findSiteById(id);

    if (!site) {
      return errorResponse(
        "站点不存在",
        `找不到ID为 ${id} 的站点`,
        404,
        ErrorCode.NOT_FOUND
      );
    }

    return successResponse(site, "获取站点详情成功");
  } catch (error) {
    console.error(`获取站点详情失败:`, error);

    return errorResponse(
      "获取站点详情失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.QUERY_ERROR
    );
  }
}

/**
 * 更新站点
 * PUT /api/sites/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 确保数据库已初始化
    await ensureInitialized();

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return errorResponse(
        "无效的站点ID",
        "站点ID必须是数字",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // 获取请求体
    const siteData = await request.json();

    // 更新站点
    const updateSite = await sitesService.updateSiteById(id, siteData);

    if (!updateSite) {
      return errorResponse(
        "站点不存在",
        `找不到ID为 ${id} 的站点`,
        404,
        ErrorCode.NOT_FOUND
      );
    }

    return successResponse(updateSite, "更新站点成功");
  } catch (error) {
    console.error(`更新站点失败:`, error);

    return errorResponse(
      "更新站点失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.SERVER_ERROR
    );
  }
}

/**
 * 删除站点
 * DELETE /api/sites/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 确保数据库已初始化
    await ensureInitialized();

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return errorResponse(
        "无效的站点ID",
        "站点ID必须是数字",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // 删除站点
    const success = await sitesService.deleteSiteById(id);

    if (!success) {
      return errorResponse(
        "站点不存在",
        `找不到ID为 ${id} 的站点`,
        404,
        ErrorCode.NOT_FOUND
      );
    }

    return successResponse(null, "删除站点成功");
  } catch (error) {
    console.error(`删除站点失败:`, error);

    return errorResponse(
      "删除站点失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.SERVER_ERROR
    );
  }
}
