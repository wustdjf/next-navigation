import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import configsService from "@/services/configsService";

/**
 * 获取单个配置
 * GET /api/configs/[key]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const key = params.key;

    if (!key) {
      return errorResponse(
        "无效的配置key",
        "配置key不能为空",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    const config = await configsService.findConfigByKey(key);

    if (!config) {
      return errorResponse(
        "配置不存在",
        `找不到key为 ${key} 的配置`,
        404,
        ErrorCode.NOT_FOUND
      );
    }

    return successResponse(config, "获取配置成功");
  } catch (error) {
    console.error(`获取配置失败:`, error);

    return errorResponse(
      "获取配置失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.QUERY_ERROR
    );
  }
}

/**
 * 更新单个配置
 * PUT /api/configs/[key]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const key = params.key;

    if (!key) {
      return errorResponse(
        "无效的配置key",
        "配置key不能为空",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // 获取请求体
    const { value } = await request.json();

    if (typeof value !== "string") {
      return errorResponse(
        "无效的配置值",
        "配置值必须是字符串",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // 更新配置
    const config = await configsService.updateConfigByKey(key, value);

    return successResponse(config, "更新配置成功");
  } catch (error) {
    console.error(`更新配置失败:`, error);

    return errorResponse(
      "更新配置失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.SERVER_ERROR
    );
  }
}

/**
 * 删除配置
 * DELETE /api/configs/[key]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const key = params.key;

    if (!key) {
      return errorResponse(
        "无效的配置key",
        "配置key不能为空",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // 删除配置
    const success = await configsService.deleteConfigByKey(key);

    if (!success) {
      return errorResponse(
        "配置不存在",
        `找不到key为 ${key} 的配置`,
        404,
        ErrorCode.NOT_FOUND
      );
    }

    return successResponse(null, "删除配置成功");
  } catch (error) {
    console.error(`删除配置失败:`, error);

    return errorResponse(
      "删除配置失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.SERVER_ERROR
    );
  }
}
