import { ensureInitialized } from "@/utils/databaseUtils";
import groupsService from "./groupsService";
import sitesService from "./sitesService";
import configsService from "./configsService";

interface ImportData {
  groups?: Array<{ id?: number; name: string; order_num: number }>;
  sites?: Array<{
    id?: number;
    group_id: number;
    name: string;
    url: string;
    icon?: string;
    description?: string;
    notes?: string;
    order_num: number;
  }>;
  configs?: Record<string, string>;
}

class DataService {
  // 导入数据
  async importData(data: ImportData): Promise<{
    groupsCount: number;
    sitesCount: number;
    configsCount: number;
  }> {
    try {
      await ensureInitialized();

      let groupsCount = 0;
      let sitesCount = 0;
      let configsCount = 0;
      const errors: string[] = [];

      // 创建旧ID到新ID的映射
      const groupIdMap: Record<number, number> = {};

      // 导入分组
      if (data.groups && Array.isArray(data.groups)) {
        for (const group of data.groups) {
          try {
            const newGroup = await groupsService.createGroup({
              name: group.name,
              order_num: group.order_num,
            });
            // 记录旧ID到新ID的映射
            if (group.id) {
              groupIdMap[group.id] = newGroup.id;
            }
            groupsCount++;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.error("导入分组失败:", errorMsg);
            errors.push(`分组导入失败: ${errorMsg}`);
          }
        }
      }

      // 导入站点
      if (data.sites && Array.isArray(data.sites)) {
        for (const site of data.sites) {
          try {
            // 使用映射后的group_id，如果没有映射则使用原始ID
            let mappedGroupId = site.group_id;
            if (groupIdMap[site.group_id]) {
              mappedGroupId = groupIdMap[site.group_id];
            }
            
            await sitesService.createSite({
              group_id: mappedGroupId,
              name: site.name,
              url: site.url,
              icon: site.icon,
              description: site.description,
              notes: site.notes,
              order_num: site.order_num,
            });
            sitesCount++;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.error("导入站点失败:", errorMsg);
            errors.push(`站点导入失败 (${site.name}): ${errorMsg}`);
          }
        }
      }

      // 导入配置
      if (data.configs && typeof data.configs === "object") {
        for (const [key, value] of Object.entries(data.configs)) {
          try {
            if (typeof value === "string") {
              await configsService.updateConfigByKey(key, value);
              configsCount++;
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.error("导入配置失败:", errorMsg);
            errors.push(`配置导入失败: ${errorMsg}`);
          }
        }
      }

      // 如果有错误，抛出异常
      if (errors.length > 0) {
        throw new Error(`导入过程中出现错误:\n${errors.join("\n")}`);
      }

      return {
        groupsCount,
        sitesCount,
        configsCount,
      };
    } catch (error) {
      console.error("导入数据失败:", error);
      throw error;
    }
  }

  // 导出数据
  async exportData(): Promise<ImportData> {
    try {
      await ensureInitialized();

      const groups = await groupsService.findAllGroups();
      const sites = await sitesService.findAllSites();
      const configs = await configsService.getConfigsAsObject();

      return {
        groups: groups.map((g) => ({
          id: g.id,
          name: g.name,
          order_num: g.order_num,
        })),
        sites: sites.map((s) => ({
          id: s.id,
          group_id: s.group_id,
          name: s.name,
          url: s.url,
          icon: s.icon,
          description: s.description,
          notes: s.notes,
          order_num: s.order_num,
        })),
        configs,
      };
    } catch (error) {
      console.error("导出数据失败:", error);
      throw error;
    }
  }
}

// 导出单例实例
export const dataService = new DataService();
export default dataService;
