import { AppDataSource } from "@/configs/database";
import { GroupsEntity } from "@/entities/groups.entity";
import { Like, Repository } from "typeorm";
import { ensureInitialized } from "../utils/databaseUtils";

// 定义查询过滤参数接口
export interface GroupFilter {
  pageNum?: number;
  pageSize?: number;
  name?: string;
  type?: string;
}

class GroupsService {
  // 获取仓库实例
  private async getRepository(): Promise<Repository<GroupsEntity>> {
    // 确保数据库连接已初始化
    await ensureInitialized();
    return AppDataSource.getRepository(GroupsEntity);
  }

  // 获取全部分组列表
  async findAllGroups(): Promise<GroupsEntity[]> {
    try {
      const groupRepository = await this.getRepository();

      const qb = await groupRepository
        .createQueryBuilder("groups")
        .orderBy("groups.updated_at", "DESC");

      const list = await qb.getMany();
      return list;
    } catch (error) {
      console.error(`获取全部分组失败:`, error);
      throw error;
    }
  }

  // 获取分组列表，支持分页和过滤
  async getGroups(filter: GroupFilter = {}): Promise<{
    data: GroupsEntity[];
    total: number;
    pageNum: number;
    pageSize: number;
  }> {
    try {
      const groupRepository = await this.getRepository();

      const { pageNum = 1, pageSize = 10, name, type } = filter;

      // 构建查询条件
      const where: any = {};
      if (name) {
        where.name = Like(`%${name}%`); // 模糊搜索
      }
      if (type) {
        where.type = type;
      }

      // 执行查询，获取分页数据
      const [data, total] = await groupRepository.findAndCount({
        where,
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
      });

      return {
        data,
        total,
        pageNum,
        pageSize,
      };
    } catch (error) {
      console.error("获取分组列表失败:", error);
      throw error;
    }
  }

  // 根据ID获取单个分组
  async getGroupById(id: number): Promise<GroupsEntity | null> {
    try {
      const groupRepository = await this.getRepository();
      return await groupRepository.findOneBy({ id });
    } catch (error) {
      console.error(`获取分组 ID ${id} 失败:`, error);
      throw error;
    }
  }

  // 创建分组
  async createGroup(groupData: Partial<GroupsEntity>): Promise<GroupsEntity> {
    try {
      console.log("🔄 开始创建分组，数据:", groupData);
      const groupRepository = await this.getRepository();
      console.log("✓ 获取分组仓库成功");
      
      const group = groupRepository.create(groupData);
      console.log("✓ 创建分组实例成功:", group);

      const savedGroup = await groupRepository.save(group);
      console.log("✓ 分组保存成功:", savedGroup);
      return savedGroup;
    } catch (error) {
      console.error("❌ 创建分组失败:", error);
      throw error;
    }
  }

  // 更新分组
  async updateGroupById(
    id: number,
    groupData: Partial<GroupsEntity>
  ): Promise<GroupsEntity | null> {
    try {
      const groupRepository = await this.getRepository();
      const group = await groupRepository.findOneBy({ id });

      if (!group) {
        return null;
      }

      // 合并更新数据
      Object.assign(group, groupData);

      return await groupRepository.save(group);
    } catch (error) {
      console.error(`更新分组 ID ${id} 失败:`, error);
      throw error;
    }
  }

  // 删除分组
  async deleteGroup(id: number): Promise<boolean> {
    try {
      const groupRepository = await this.getRepository();
      const result = await groupRepository.delete(id);
      return result.affected ? result.affected > 0 : false;
    } catch (error) {
      console.error(`删除分组 ID ${id} 失败:`, error);
      throw error;
    }
  }

  // 批量更新分组排序
  async updateGroupOrder(
    groupOrders: Array<{ id: number; order_num: number }>
  ): Promise<boolean> {
    try {
      const groupRepository = await this.getRepository();

      for (const order of groupOrders) {
        await groupRepository.update(order.id, { order_num: order.order_num });
      }

      return true;
    } catch (error) {
      console.error("批量更新分组排序失败:", error);
      throw error;
    }
  }
}

// 导出单例实例
export const groupsService = new GroupsService();
export default groupsService;
