import { AppDataSource } from "@/configs/database";
import { User } from "@/entities/user.entity";
import { Repository } from "typeorm";
import { validate } from "class-validator";
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
      const userRepository = await this.getRepository();
      const user = userRepository.create(userData);

      // 验证用户数据
      const errors = await validate(user);
      if (errors.length > 0) {
        throw new Error(
          `验证错误: ${errors
            .map((error) => Object.values(error.constraints || {}).join(", "))
            .join("; ")}`
        );
      }

      return await userRepository.save(user);
    } catch (error) {
      console.error("创建用户失败:", error);
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

      // 验证更新后的数据
      const errors = await validate(user);
      if (errors.length > 0) {
        throw new Error(
          `验证错误: ${errors
            .map((error) => Object.values(error.constraints || {}).join(", "))
            .join("; ")}`
        );
      }

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
      const userRepository = await this.getRepository();
      return await userRepository.findOneBy({ username });
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

      // 验证更新后的数据
      const errors = await validate(user);
      if (errors.length > 0) {
        throw new Error(
          `验证错误: ${errors
            .map((error) => Object.values(error.constraints || {}).join(", "))
            .join("; ")}`
        );
      }

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
