import { AppDataSource } from "@/configs/database";
import { SitesEntity } from "@/entities/sites.entity";
import { Repository } from "typeorm";
import { validate } from "class-validator";
import { ensureInitialized } from "@/utils/databaseUtils";

class SitesService {
  // 获取仓库实例
  private async getRepository(): Promise<Repository<SitesEntity>> {
    await ensureInitialized();
    return AppDataSource.getRepository(SitesEntity);
  }

  // 根据id查找站点
  async findSiteById(id: number): Promise<SitesEntity | null> {
    try {
      const sitesRepository = await this.getRepository();
      return await sitesRepository.findOneBy({ id });
    } catch (error) {
      console.error(`查找站点id： ${id} 失败:`, error);
      throw error;
    }
  }

  // 创建新站点
  async createSite(siteData: Partial<SitesEntity>): Promise<SitesEntity> {
    try {
      const sitesRepository = await this.getRepository();
      const site = sitesRepository.create(siteData);

      // 验证用户数据
      const errors = await validate(site);
      if (errors.length > 0) {
        throw new Error(
          `验证错误: ${errors
            .map((error) => Object.values(error.constraints || {}).join(", "))
            .join("; ")}`
        );
      }

      return await sitesRepository.save(site);
    } catch (error) {
      console.error("创建站点失败:", error);
      throw error;
    }
  }
}

// 导出单例实例
export const sitesService = new SitesService();
export default sitesService;
