import { AppDataSource } from "@/configs/database";
import { SitesEntity } from "@/entities/sites.entity";
import { Repository } from "typeorm";
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

  // 获取所有站点
  async findAllSites(): Promise<SitesEntity[]> {
    try {
      const sitesRepository = await this.getRepository();
      return await sitesRepository.find({
        order: { order_num: "ASC" },
      });
    } catch (error) {
      console.error("获取所有站点失败:", error);
      throw error;
    }
  }

  // 获取分组下的站点
  async getSitesByGroupId(groupId: number): Promise<SitesEntity[]> {
    try {
      const sitesRepository = await this.getRepository();
      return await sitesRepository.find({
        where: { group_id: groupId },
        order: { order_num: "ASC" },
      });
    } catch (error) {
      console.error(`获取分组 ${groupId} 下的站点失败:`, error);
      throw error;
    }
  }

  // 创建新站点
  async createSite(siteData: Partial<SitesEntity>): Promise<SitesEntity> {
    try {
      const sitesRepository = await this.getRepository();
      const site = sitesRepository.create(siteData);

      return await sitesRepository.save(site);
    } catch (error) {
      console.error("创建站点失败:", error);
      throw error;
    }
  }

  // 更新站点
  async updateSiteById(
    id: number,
    siteData: Partial<SitesEntity>
  ): Promise<SitesEntity | null> {
    try {
      const sitesRepository = await this.getRepository();
      const site = await sitesRepository.findOneBy({ id });

      if (!site) {
        return null;
      }

      // 合并更新数据
      Object.assign(site, siteData);

      return await sitesRepository.save(site);
    } catch (error) {
      console.error(`更新站点 ID ${id} 失败:`, error);
      throw error;
    }
  }

  // 删除站点
  async deleteSiteById(id: number): Promise<boolean> {
    try {
      const sitesRepository = await this.getRepository();
      const result = await sitesRepository.delete(id);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      console.error(`删除站点 ID ${id} 失败:`, error);
      throw error;
    }
  }

  // 批量更新站点排序
  async updateSiteOrder(
    siteOrders: Array<{ id: number; order_num: number }>
  ): Promise<boolean> {
    try {
      const sitesRepository = await this.getRepository();

      for (const order of siteOrders) {
        await sitesRepository.update(order.id, { order_num: order.order_num });
      }

      return true;
    } catch (error) {
      console.error("批量更新站点排序失败:", error);
      throw error;
    }
  }
}

// 导出单例实例
export const sitesService = new SitesService();
export default sitesService;
