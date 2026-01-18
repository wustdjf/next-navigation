import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import { ensureInitialized } from "@/utils/databaseUtils";
import sitesService from "@/services/sitesService";

/**
 * 批量更新站点排序
 * PUT /api/sites/order
 */
export async function PUT(request: NextRequest) {
  try {
    // 确保数据库已初始化
    await ensureInitialized();

    // 获取请求体
    const siteOrders = await request.json();

    if (!Array.isArray(siteOrders)) {
      return errorResponse(
        "无效的请求数据",
        "请求体必须是数组",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // 验证数据格式
    for (const order of siteOrders) {
      if (typeof order.id !== "number" || typeof order.order_num !== "number") {
        return errorResponse(
          "无效的请求数据",
          "每个项目必须包含 id 和 order_num",
          400,
          ErrorCode.VALIDATION_ERROR
        );
      }
    }

    // 更新站点排序
    const success = await sitesService.updateSiteOrder(siteOrders);

    if (!success) {
      return errorResponse(
        "更新站点排序失败",
        "未知错误",
        500,
        ErrorCode.SERVER_ERROR
      );
    }

    return successResponse(null, "更新站点排序成功");
  } catch (error) {
    console.error("更新站点排序失败:", error);

    return errorResponse(
      "更新站点排序失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.SERVER_ERROR
    );
  }
}
