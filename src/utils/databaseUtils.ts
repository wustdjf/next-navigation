import { initDatabase } from "@/configs/database";

// 确保数据库已初始化
export const ensureInitialized = async () => {
  try {
    await initDatabase();
  } catch (error) {
    console.error("数据库初始化失败:", error);
    throw error;
  }
};
