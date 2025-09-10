// 用户相关API
import axios from "axios";

// 用户数据接口
export interface User {
  id: string;
  username: string;
  nickname?: string;
  password?: string;
  avatar?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

// 获取用户详情
export async function getUserById(id: string) {
  try {
    const response = await axios.get(`/api/user/${id}`);
    return response.data;
  } catch (error) {
    console.error(`获取用户 ID ${id} 详情失败:`, error);
    throw error;
  }
}

// 创建用户
export async function createUser(data: Omit<User, "id">) {
  try {
    const response = await axios.post("/api/user/create", data);
    return response.data;
  } catch (error) {
    console.error("创建用户失败:", error);
    throw error;
  }
}

// 更新用户
export async function updateUser(id: string, data: Partial<User>) {
  try {
    const response = await axios.put(`/api/user/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`更新用户 ID ${id} 失败:`, error);
    throw error;
  }
}

// 删除用户
export async function deleteUser(id: string) {
  try {
    const response = await axios.delete(`/api/user/${id}`);
    return response.data;
  } catch (error) {
    console.error(`删除用户 ID ${id} 失败:`, error);
    throw error;
  }
}
