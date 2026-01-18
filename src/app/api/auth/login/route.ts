import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import authService from "@/services/authService";
import { ensureInitialized } from "@/utils/databaseUtils";

/**
 * 用户登录
 * POST /api/auth/login
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const { username, password } = await request.json();

    if (!username || !password) {
      return errorResponse(
        "缺少必要参数",
        "用户名和密码不能为空",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // 确保数据库已初始化
    await ensureInitialized();

    // 用户登录
    const user = await authService.login(username, password);

    if (!user) {
      return errorResponse(
        "登录失败",
        "用户名或密码错误",
        401,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // 生成Token
    const token = authService.generateToken(user.id);

    return successResponse(
      {
        user,
        token,
      },
      "登录成功"
    );
  } catch (error) {
    console.error("登录失败:", error);

    return errorResponse(
      "登录失败",
      error instanceof Error ? error.message : "未知错误",
      500,
      ErrorCode.SERVER_ERROR
    );
  }
}
