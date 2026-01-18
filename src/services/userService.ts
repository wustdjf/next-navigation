import { AppDataSource } from "@/configs/database";
import { User } from "@/entities/user.entity";
import { Repository } from "typeorm";
import { ensureInitialized } from "@/utils/databaseUtils";

class UserService {
  // 获取仓库实例
  private async getRepository(): Promise<Repository<User>> {
    await ensureInitialized();
    return AppDataSource.getRepository(User);
  }

  // 创建新用户
  async createUser(userData: Partial<User>): Promise<User> {
    try {
      console.log("=== createUser 开始 ===");
      console.log("输入数据:", userData);
      
      const userRepository = await this.getRepository();
      console.log("✓ 获取 userRepository 成功");
      
      const user = userRepository.create(userData);
      console.log("✓ User 实体创建成功:", { id: user.id, username: user.username });

      console.log("开始保存用户到数据库...");
      const savedUser = await userRepository.save(user);
      console.log("✓ 用户保存成功");
      console.log("保存的用户信息:", { id: savedUser.id, username: savedUser.username, created_at: savedUser.created_at });
      
      // 验证保存后的数据
      console.log("验证保存的数据...");
      const verifyUser = await userRepository.findOneBy({ id: savedUser.id });
      if (verifyUser) {
        console.log("✓ 数据库中已验证用户存在");
      } else {
        console.warn("⚠ 警告: 用户保存后无法从数据库查询到");
      }
      
      console.log("=== createUser 完成 ===");
      return savedUser;
    } catch (error) {
      console.error("=== createUser 失败 ===");
      console.error("错误详情:", error);
      throw error;
    }
  }

  // 获取全部分组列表
  async findAllUsers(): Promise<User[]> {
    try {
      const userRepository = await this.getRepository();

      const qb = await userRepository
        .createQueryBuilder("user")
        .orderBy("user.updated_at", "DESC");

      const list = await qb.getMany();
      return list;
    } catch (error) {
      console.error(`获取全部用户失败:`, error);
      throw error;
    }
  }

  // 根据账号查找用户
  async findUserById(id: string): Promise<User | null> {
    try {
      const userRepository = await this.getRepository();
      return await userRepository.findOneBy({ id });
    } catch (error) {
      console.error(`查找用户 ${id} 失败:`, error);
      throw error;
    }
  }

  // 根据账号更新用户
  async updateUserById(
    id: string,
    userData: Partial<User>
  ): Promise<User | null> {
    try {
      const userRepository = await this.getRepository();
      const user = await userRepository.findOneBy({ id });

      if (!user) {
        return null;
      }

      // 合并更新数据
      Object.assign(user, userData);

      return await userRepository.save(user);
    } catch (error) {
      console.error(`更新用户 ID ${id} 失败:`, error);
      throw error;
    }
  }

  // 根据账号删除用户
  async deleteUserById(id: string): Promise<boolean> {
    try {
      const userRepository = await this.getRepository();
      const result = await userRepository.delete(id);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      console.error(`删除用户 ID ${id} 失败:`, error);
      throw error;
    }
  }

  // 根据用户名查找用户
  async findUserByUsername(username: string): Promise<User | null> {
    try {
      console.log("findUserByUsername 开始，查找用户:", username);
      const userRepository = await this.getRepository();
      console.log("获取 userRepository 成功");
      const user = await userRepository.findOneBy({ username });
      console.log("查找结果:", user ? "用户存在" : "用户不存在");
      return user;
    } catch (error) {
      console.error(`查找用户 ${username} 失败:`, error);
      throw error;
    }
  }

  // 根据用户名更新用户
  async updateUserByUsername(
    username: string,
    userData: Partial<User>
  ): Promise<User | null> {
    try {
      const userRepository = await this.getRepository();
      const user = await userRepository.findOneBy({ username });

      if (!user) {
        return null;
      }

      // 合并更新数据
      Object.assign(user, userData);

      return await userRepository.save(user);
    } catch (error) {
      console.error(`更新用户 ${username} 失败:`, error);
      throw error;
    }
  }

  // 根据用户名删除用户
  async deleteUserByUsername(username: string): Promise<boolean> {
    try {
      const userRepository = await this.getRepository();
      const result = await userRepository.delete(username);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      console.error(`删除用户 ${username} 失败:`, error);
      throw error;
    }
  }
}

// 导出单例实例
export const userService = new UserService();
export default userService;
