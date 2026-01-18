import axios from "axios";
import type { Site } from "@/types/sites";
import type { Group } from "@/types/groups";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器 - 添加token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 如果响应中有data字段，返回data
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    console.error("API错误:", error);
    
    // 处理401未授权错误
    if (error.response?.status === 401) {
      console.warn("⚠️ Token过期或无效，清除本地存储并重定向到首页");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      
      // 重定向到首页
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    
    throw error;
  }
);

// ==================== 分组API ====================

export async function getGroups(): Promise<Group[]> {
  try {
    const response = await apiClient.get("/api/groups/all");
    return response as unknown as Group[];
  } catch (error) {
    console.error("获取分组列表失败:", error);
    throw error;
  }
}

export async function getGroupById(id: number): Promise<Group> {
  try {
    const response = await apiClient.get(`/api/groups/${id}`);
    return response as unknown as Group;
  } catch (error) {
    console.error(`获取分组 ID ${id} 详情失败:`, error);
    throw error;
  }
}

export async function createGroup(data: Omit<Group, "id">): Promise<Group> {
  try {
    const response = await apiClient.post("/api/groups/create", data);
    return response as unknown as Group;
  } catch (error) {
    console.error("创建分组失败:", error);
    throw error;
  }
}

export async function updateGroup(
  id: number,
  data: Partial<Group>
): Promise<Group> {
  try {
    const response = await apiClient.put(`/api/groups/${id}`, data);
    return response as unknown as Group;
  } catch (error) {
    console.error(`更新分组 ID ${id} 失败:`, error);
    throw error;
  }
}

export async function deleteGroup(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/groups/${id}`);
  } catch (error) {
    console.error(`删除分组 ID ${id} 失败:`, error);
    throw error;
  }
}

export async function updateGroupOrder(
  groupOrders: Array<{ id: number; order_num: number }>
): Promise<void> {
  try {
    await apiClient.put("/api/groups/order", groupOrders);
  } catch (error) {
    console.error("更新分组排序失败:", error);
    throw error;
  }
}

// ==================== 站点API ====================

export async function getSites(groupId: number): Promise<Site[]> {
  try {
    const response = await apiClient.get("/api/sites/list", {
      params: { groupId },
    });
    return response as unknown as Site[];
  } catch (error) {
    console.error(`获取分组 ${groupId} 下的站点失败:`, error);
    throw error;
  }
}

export async function getSiteById(id: number): Promise<Site> {
  try {
    const response = await apiClient.get(`/api/sites/${id}`);
    return response as unknown as Site;
  } catch (error) {
    console.error(`获取站点 ID ${id} 详情失败:`, error);
    throw error;
  }
}

export async function createSite(data: Omit<Site, "id">): Promise<Site> {
  try {
    const response = await apiClient.post("/api/sites/create", data);
    return response as unknown as Site;
  } catch (error) {
    console.error("创建站点失败:", error);
    throw error;
  }
}

export async function updateSite(
  id: number,
  data: Partial<Site>
): Promise<Site> {
  try {
    const response = await apiClient.put(`/api/sites/${id}`, data);
    return response as unknown as Site;
  } catch (error) {
    console.error(`更新站点 ID ${id} 失败:`, error);
    throw error;
  }
}

export async function deleteSite(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/sites/${id}`);
  } catch (error) {
    console.error(`删除站点 ID ${id} 失败:`, error);
    throw error;
  }
}

export async function updateSiteOrder(
  siteOrders: Array<{ id: number; order_num: number }>
): Promise<void> {
  try {
    await apiClient.put("/api/sites/order", siteOrders);
  } catch (error) {
    console.error("更新站点排序失败:", error);
    throw error;
  }
}

// ==================== 配置API ====================

export async function getConfigs(): Promise<Record<string, string>> {
  try {
    const response = await apiClient.get("/api/configs");
    return response as unknown as Record<string, string>;
  } catch (error) {
    console.error("获取配置失败:", error);
    throw error;
  }
}

export async function getConfigByKey(key: string): Promise<string> {
  try {
    const response = await apiClient.get(`/api/configs/${key}`);
    return (response as unknown as { value: string }).value;
  } catch (error) {
    console.error(`获取配置 ${key} 失败:`, error);
    throw error;
  }
}

export async function setConfigs(
  configs: Record<string, string>
): Promise<void> {
  try {
    await apiClient.post("/api/configs", configs);
  } catch (error) {
    console.error("更新配置失败:", error);
    throw error;
  }
}

export async function setConfigByKey(key: string, value: string): Promise<void> {
  try {
    await apiClient.put(`/api/configs/${key}`, { value });
  } catch (error) {
    console.error(`更新配置 ${key} 失败:`, error);
    throw error;
  }
}

export async function deleteConfig(key: string): Promise<void> {
  try {
    await apiClient.delete(`/api/configs/${key}`);
  } catch (error) {
    console.error(`删除配置 ${key} 失败:`, error);
    throw error;
  }
}

// ==================== 数据导入导出API ====================

export async function importData(data: any): Promise<void> {
  try {
    await apiClient.post("/api/data/import", data);
  } catch (error) {
    console.error("导入数据失败:", error);
    throw error;
  }
}

export async function exportData(): Promise<any> {
  try {
    const response = await apiClient.get("/api/data/export");
    return response;
  } catch (error) {
    console.error("导出数据失败:", error);
    throw error;
  }
}

// ==================== 认证API ====================

export async function login(
  username: string,
  password: string
): Promise<{ user: any; token: string }> {
  try {
    const response = await apiClient.post("/api/auth/login", {
      username,
      password,
    });
    return response as unknown as { user: any; token: string };
  } catch (error) {
    console.error("登录失败:", error);
    throw error;
  }
}

export async function register(
  username: string,
  password: string,
  nickname?: string
): Promise<{ user: any; token: string }> {
  try {
    const response = await apiClient.post("/api/auth/register", {
      username,
      password,
      nickname,
    });
    return response as unknown as { user: any; token: string };
  } catch (error) {
    console.error("注册失败:", error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/api/auth/logout");
  } catch (error) {
    console.error("登出失败:", error);
    throw error;
  }
}

// ==================== 用户API ====================

export async function updateUserProfile(data: {
  nickname?: string;
  email?: string;
  avatar?: string;
}): Promise<any> {
  try {
    const response = await apiClient.put("/api/user/profile", data);
    return response as unknown as any;
  } catch (error) {
    console.error("更新用户资料失败:", error);
    throw error;
  }
}

export default {
  // 分组
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  updateGroupOrder,
  // 站点
  getSites,
  getSiteById,
  createSite,
  updateSite,
  deleteSite,
  updateSiteOrder,
  // 配置
  getConfigs,
  getConfigByKey,
  setConfigs,
  setConfigByKey,
  deleteConfig,
  // 数据导入导出
  importData,
  exportData,
  // 认证
  login,
  register,
  logout,
  // 用户
  updateUserProfile,
};
