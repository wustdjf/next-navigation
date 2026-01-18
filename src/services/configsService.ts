import { AppDataSource } from "@/configs/database";
import { ConfigsEntity } from "@/entities/configs.entity";
import { Repository } from "typeorm";
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

  // 获取所有配置
  async findAllConfigs(): Promise<ConfigsEntity[]> {
    try {
      const configRepository = await this.getRepository();
      return await configRepository.find();
    } catch (error) {
      console.error("获取所有配置失败:", error);
      throw error;
    }
  }

  // 获取配置为对象格式
  async getConfigsAsObject(): Promise<Record<string, string>> {
    try {
      const configs = await this.findAllConfigs();
      const result: Record<string, string> = {};
      configs.forEach((config) => {
        result[config.key] = config.value;
      });
      return result;
    } catch (error) {
      console.error("获取配置对象失败:", error);
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
      return await configRepository.save(config);
    } catch (error) {
      console.error("创建配置失败:", error);
      throw error;
    }
  }

  // 更新配置
  async updateConfigByKey(
    key: string,
    value: string
  ): Promise<ConfigsEntity> {
    try {
      const configRepository = await this.getRepository();
      let config = await configRepository.findOneBy({ key });

      if (!config) {
        // 如果配置不存在，创建新配置
        config = configRepository.create({ key, value });
      } else {
        // 更新现有配置
        config.value = value;
      }

      return await configRepository.save(config);
    } catch (error) {
      console.error(`更新配置 ${key} 失败:`, error);
      throw error;
    }
  }

  // 删除配置
  async deleteConfigByKey(key: string): Promise<boolean> {
    try {
      const configRepository = await this.getRepository();
      const result = await configRepository.delete(key);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      console.error(`删除配置 ${key} 失败:`, error);
      throw error;
    }
  }
}

// 导出单例实例
export const configsService = new ConfigsService();
export default configsService;
