import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/entities/user.entity";
import { SitesEntity } from "@/entities/sites.entity";
import { GroupsEntity } from "@/entities/groups.entity";
import { ConfigsEntity } from "@/entities/configs.entity";

// 声明全局变量以在开发环境热重载中保持数据库连接
declare global {
  var dbConnection: {
    dataSource: DataSource | undefined;
    promise: Promise<DataSource> | null;
    initialized: boolean;
  };
}

// 初始化全局变量
if (!global.dbConnection) {
  global.dbConnection = {
    dataSource: undefined,
    promise: null,
    initialized: false,
  };
}

// 创建数据库连接实例
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWD || "password",
  database: process.env.DB_DATABASE || "navigationDB",
  synchronize: false, // 禁用自动同步，避免表创建冲突
  logging: process.env.NODE_ENV !== "production",
  entities: [User, SitesEntity, GroupsEntity, ConfigsEntity],
  migrations: [],
  subscribers: [],
  connectTimeout: 20000,
  maxQueryExecutionTime: 30000,
});

// 初始化数据库连接
export const initDatabase = async (): Promise<DataSource> => {
  try {
    // 如果已初始化且连接仍然活跃，直接返回
    if (
      global.dbConnection.initialized &&
      global.dbConnection.dataSource &&
      global.dbConnection.dataSource.isInitialized
    ) {
      console.log("✓ 数据库已初始化且连接活跃，直接返回");
      return global.dbConnection.dataSource;
    }

    // 如果已经有初始化中的Promise，则等待它完成
    if (global.dbConnection.promise) {
      console.log("⏳ 数据库初始化中，等待完成...");
      return global.dbConnection.promise;
    }

    // 创建新的初始化Promise
    global.dbConnection.promise = (async () => {
      try {
        console.log("🔄 开始初始化数据库...");
        console.log("📋 数据库配置:", {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          database: process.env.DB_DATABASE,
          user: process.env.DB_USER,
        });

        // 如果之前有连接，先关闭它
        if (AppDataSource.isInitialized) {
          console.log("🔌 关闭旧的数据库连接...");
          try {
            await AppDataSource.destroy();
            console.log("✓ 旧连接已关闭");
          } catch (e) {
            console.warn("⚠ 关闭旧连接时出错:", e);
          }
        }

        console.log("🔗 初始化新的数据库连接...");
        console.log("📦 注册的实体:", AppDataSource.options.entities);
        await AppDataSource.initialize();
        console.log("✓ 数据库连接成功");
        console.log("✓ 数据库已初始化");
        console.log("✓ 已注册的实体元数据:", AppDataSource.entityMetadatas.map(m => m.name));

        global.dbConnection.dataSource = AppDataSource;
        global.dbConnection.initialized = true;
        return AppDataSource;
      } catch (error) {
        console.error("✗ 数据库连接失败:", error);
        console.error("错误详情:", {
          message: error instanceof Error ? error.message : "未知错误",
          stack: error instanceof Error ? error.stack : undefined,
        });
        global.dbConnection.promise = null;
        global.dbConnection.initialized = false;
        throw error;
      }
    })();

    return global.dbConnection.promise;
  } catch (error) {
    console.error("✗ initDatabase 异常:", error);
    throw error;
  }
};
