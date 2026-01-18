import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import { verifyTokenFromRequest, createUnauthorizedResponse } from "@/utils/authMiddleware";
import { ensureInitialized } from "@/utils/databaseUtils";
import sitesService from "@/services/sitesService";

/**
 * 获取站点列表
 * GET /api/sites/list
 */
export async function GET(request: NextRequest) {
  try {
    // 验证token
    const userId = verifyTokenFromRequest(request);
    if (!userId) {
      return createUnauthorizedResponse("Token无效或已过期");
    }

    // 确保数据库已初始化
    await ensureInitialized();

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const groupId = searchParams.get("groupId");

    let sites;

    if (groupId) {
      // 如果指定了分组ID，获取该分组下的站点
      sites = await sitesService.getSitesByGroupId(parseInt(groupId));
    } else {
      // 否则获取所有站点
      sites = await sitesService.findAllSites();
    }

    return successResponse(sites, "获取站点列表成功");
  } catch (error) {
    console.error("获取站点列表失败:", error);

    return errorResponse(
      "获取站点列表失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.QUERY_ERROR
    );
  }
}
