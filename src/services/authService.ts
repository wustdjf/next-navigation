import { AppDataSource } from "@/configs/database";
import { User } from "@/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { ensureInitialized } from "@/utils/databaseUtils";
import userService from "./userService";

class AuthService {
  // 获取仓库实例
  private async getRepository(): Promise<Repository<User>> {
    await ensureInitialized();
    return AppDataSource.getRepository(User);
  }

  // 用户登录
  async login(username: string, password: string): Promise<User | null> {
    try {
      console.log("authService.login() 开始:", { username });
      const userRepository = await this.getRepository();

      // 查找用户，需要包含密码字段
      const user = await userRepository
        .createQueryBuilder("user")
        .where("user.username = :username", { username })
        .addSelect("user.password")
        .getOne();

      if (!user) {
        console.log("用户不存在:", username);
        return null;
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        console.log("密码验证失败");
        return null;
      }

      console.log("authService.login() 成功");
      // 返回用户信息（不包含密码）
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      console.error("用户登录失败:", error);
      throw error;
    }
  }

  // 用户注册
  async register(
    username: string,
    password: string,
    nickname?: string
  ): Promise<User> {
    try {
      console.log("authService.register() 开始:", { username });
      
      // 检查用户是否已存在
      console.log("检查用户是否已存在...");
      const existingUser = await userService.findUserByUsername(username);

      if (existingUser) {
        console.log("用户已存在:", username);
        throw new Error("用户名已存在");
      }

      console.log("用户不存在，开始创建...");
      // 创建新用户
      const newUser = await userService.createUser({
        username,
        password,
        nickname: nickname || username,
      });

      console.log("authService.register() 完成，用户已创建:", newUser.id);
      return newUser;
    } catch (error) {
      console.error("authService.register() 失败:", error);
      throw error;
    }
  }

  // 验证密码
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error("密码验证失败:", error);
      return false;
    }
  }

  // 生成JWT Token（简单实现，实际应使用jsonwebtoken库）
  generateToken(userId: string): string {
    // 这是一个简单的实现，实际应该使用jsonwebtoken库
    // 格式: base64(userId.timestamp)
    const payload = `${userId}.${Date.now()}`;
    return Buffer.from(payload).toString("base64");
  }

  // 验证Token
  verifyToken(token: string): string | null {
    try {
      const payload = Buffer.from(token, "base64").toString("utf-8");
      const [userId] = payload.split(".");
      return userId;
    } catch (error) {
      console.error("Token验证失败:", error);
      return null;
    }
  }
}

// 导出单例实例
export const authService = new AuthService();
export default authService;
