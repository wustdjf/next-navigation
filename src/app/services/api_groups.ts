// 分组相关API
import axios from "axios";

// 分组列表查询参数接口
export interface GroupsQuery {
  pageNum?: number;
  pageSize?: number;
  name?: string;
  type?: string;
  isHot?: boolean;
}

// 分组数据接口
export interface Group {
  id: number;
  name: string;
  order_num: number;
  created_at: string;
  updated_at: string;
}

// 获取分组列表
export async function getGroups(query: GroupsQuery = {}) {
  try {
    // 构建查询参数
    const params = new URLSearchParams();

    if (query.pageNum) params.append("pageNum", query.pageNum.toString());
    if (query.pageSize) params.append("pageSize", query.pageSize.toString());
    if (query.name) params.append("name", query.name);
    if (query.type) params.append("type", query.type);
    if (query.isHot !== undefined)
      params.append("isHot", query.isHot.toString());

    // 发送请求
    const response = await axios.get(`/api/groups/list?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("获取分组列表失败:", error);
    throw error;
  }
}

// 获取分组详情
export async function getGroupById(id: number) {
  try {
    const response = await axios.get(`/api/groups/${id}`);
    return response.data;
  } catch (error) {
    console.error(`获取分组 ID ${id} 详情失败:`, error);
    throw error;
  }
}

// 创建分组
export async function createGroup(data: Omit<Group, "id">) {
  try {
    const response = await axios.post("/api/groups/create", data);
    return response.data;
  } catch (error) {
    console.error("创建产品失败:", error);
    throw error;
  }
}

// 更新分组
export async function updateGroup(id: number, data: Partial<Group>) {
  try {
    const response = await axios.put(`/api/groups/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`更新分组 ID ${id} 失败:`, error);
    throw error;
  }
}

// 删除分组
export async function deleteGroup(id: number) {
  try {
    const response = await axios.delete(`/api/groups/${id}`);
    return response.data;
  } catch (error) {
    console.error(`删除分组 ID ${id} 失败:`, error);
    throw error;
  }
}
