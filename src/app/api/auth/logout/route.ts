import { NextRequest } from "next/server";
import { successResponse } from "@/utils/apiResponse";

/**
 * 用户登出
 * POST /api/auth/logout
 */
export async function POST(request: NextRequest) {
  try {
    // 登出逻辑（在实际应用中可能需要清除token或session）
    return successResponse(null, "登出成功");
  } catch (error) {
    console.error("登出失败:", error);
    return successResponse(null, "登出成功");
  }
}
