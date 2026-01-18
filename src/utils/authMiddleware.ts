import { NextRequest, NextResponse } from "next/server";
import authService from "@/services/authService";

/**
 * 验证请求中的token
 * @param request NextRequest对象
 * @returns 如果token有效返回userId，否则返回null
 */
export function verifyTokenFromRequest(request: NextRequest): string | null {
  try {
    // 从Authorization header中获取token
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader) {
      console.warn("⚠️ 缺少Authorization header");
      return null;
    }

    // 提取Bearer token
    const token = authHeader.replace("Bearer ", "");
    
    if (!token) {
      console.warn("⚠️ Authorization header格式错误");
      return null;
    }

    // 验证token
    const userId = authService.verifyToken(token);
    
    if (!userId) {
      console.warn("⚠️ Token验证失败");
      return null;
    }

    console.log("✓ Token验证成功，userId:", userId);
    return userId;
  } catch (error) {
    console.error("❌ Token验证异常:", error);
    return null;
  }
}

/**
 * 创建401未授权响应
 */
export function createUnauthorizedResponse(message: string = "未授权") {
  return NextResponse.json(
    {
      code: 401,
      message,
      data: null,
    },
    { status: 401 }
  );
}

/**
 * 认证中间件装饰器
 * 用于保护需要认证的API路由
 */
export function withAuth(handler: (request: NextRequest, userId: string) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      const userId = verifyTokenFromRequest(request);
      
      if (!userId) {
        console.warn("⚠️ 请求未通过认证检查");
        return createUnauthorizedResponse("Token无效或已过期");
      }

      // 调用实际的处理函数
      return await handler(request, userId);
    } catch (error) {
      console.error("❌ 认证中间件异常:", error);
      return createUnauthorizedResponse("认证失败");
    }
  };
}
