import { AppDataSource } from "@/configs/database";
import { ConfigsEntity } from "@/entities/configs.entity";
import { Repository } from "typeorm";
import { validate } from "class-validator";
import { ensureInitialized } from "@/utils/databaseUtils";

class ConfigsService {
  // 获取仓库实例
  private async getRepository(): Promise<Repository<ConfigsEntity>> {
    await ensureInitialized();
    return AppDataSource.getRepository(ConfigsEntity);
  }

  // 根据配置key查找配置信息
  async findConfigByKey(key: string): Promise<ConfigsEntity | null> {
    try {
      const configRepository = await this.getRepository();
      return await configRepository.findOneBy({ key });
    } catch (error) {
      console.error(`查找配置 ${key} 失败:`, error);
      throw error;
    }
  }

  // 创建新配置
  async createConfig(
    configData: Partial<ConfigsEntity>
  ): Promise<ConfigsEntity> {
    try {
      const configRepository = await this.getRepository();
      const config = configRepository.create(configData);

      // 验证用户数据
      const errors = await validate(config);
      if (errors.length > 0) {
        throw new Error(
          `验证错误: ${errors
            .map((error) => Object.values(error.constraints || {}).join(", "))
            .join("; ")}`
        );
      }

      return await configRepository.save(config);
    } catch (error) {
      console.error("创建配置失败:", error);
      throw error;
    }
  }
}

// 导出单例实例
export const configsService = new ConfigsService();
export default configsService;
