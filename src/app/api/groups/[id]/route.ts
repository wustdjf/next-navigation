import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import groupsService from "@/services/groupsService";

/**
 * 获取分组详情
 * GET /api/groups/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return errorResponse(
        "无效的分组ID",
        "分组ID必须是数字",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    const group = await groupsService.getGroupById(id);

    if (!group) {
      return errorResponse(
        "分组不存在",
        `找不到ID为 ${id} 的分组`,
        404,
        ErrorCode.NOT_FOUND
      );
    }

    return successResponse(group, "获取分组详情成功");
  } catch (error) {
    console.error(`获取分组详情失败:`, error);

    return errorResponse(
      "获取分组详情失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.QUERY_ERROR
    );
  }
}

/**
 * 更新分组
 * PUT /api/groups/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return errorResponse(
        "无效的分组ID",
        "分组ID必须是数字",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // 获取请求体
    const groupData = await request.json();

    // 更新产品
    const updateGroup = await groupsService.updateGroupById(id, groupData);

    if (!updateGroup) {
      return errorResponse(
        "分组不存在",
        `找不到ID为 ${id} 的分组`,
        404,
        ErrorCode.NOT_FOUND
      );
    }

    return successResponse(updateGroup, "更新分组成功");
  } catch (error) {
    console.error(`更新分组失败:`, error);

    return errorResponse(
      "更新分组失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.SERVER_ERROR
    );
  }
}

/**
 * 删除分组
 * DELETE /api/groups/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return errorResponse(
        "无效的分组ID",
        "分组ID必须是数字",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // 删除产品
    const success = await groupsService.deleteGroup(id);

    if (!success) {
      return errorResponse(
        "分组不存在",
        `找不到ID为 ${id} 的分组`,
        404,
        ErrorCode.NOT_FOUND
      );
    }

    return successResponse(null, "删除分组成功");
  } catch (error) {
    console.error(`删除分组失败:`, error);

    return errorResponse(
      "删除分组失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.SERVER_ERROR
    );
  }
}
