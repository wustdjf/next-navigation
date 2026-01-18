import { NextRequest } from "next/server";
import { successResponse, errorResponse, ErrorCode } from "@/utils/apiResponse";
import authService from "@/services/authService";
import { ensureInitialized } from "@/utils/databaseUtils";

/**
 * 用户注册
 * POST /api/auth/register
 */
export async function POST(request: NextRequest) {
  try {
    console.log("=== 开始注册流程 ===");
    
    // 获取请求体
    const { username, password, nickname } = await request.json();
    console.log("收到注册请求:", { username, nickname });

    if (!username || !password) {
      console.log("缺少必要参数");
      return errorResponse(
        "缺少必要参数",
        "用户名和密码不能为空",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    if (password.length < 6) {
      console.log("密码过短");
      return errorResponse(
        "密码过短",
        "密码长度至少为6位",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // 确保数据库已初始化
    console.log("初始化数据库...");
    await ensureInitialized();
    console.log("数据库初始化完成");

    // 用户注册
    console.log("调用 authService.register()...");
    const user = await authService.register(username, password, nickname);
    console.log("用户创建成功:", user);

    // 生成Token
    const token = authService.generateToken(user.id);
    console.log("Token 生成成功");

    console.log("=== 注册流程完成 ===");
    return successResponse(
      {
        user,
        token,
      },
      "注册成功"
    );
  } catch (error) {
    console.error("=== 注册失败 ===");
    console.error("错误详情:", error);

    const errorMessage = error instanceof Error ? error.message : "未知错误";
    const isValidationError =
      errorMessage.includes("已存在") || errorMessage.includes("验证错误");

    return errorResponse(
      "注册失败",
      errorMessage,
      isValidationError ? 400 : 500,
      isValidationError ? ErrorCode.VALIDATION_ERROR : ErrorCode.SERVER_ERROR
    );
  }
}
