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
  };
}

// 初始化全局变量
if (!global.dbConnection) {
  global.dbConnection = {
    dataSource: undefined,
    promise: null,
  };
}

// 创建数据库连接实例
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWD || "password",
  database: process.env.DB_DATABASE || "navigation-db",
  synchronize: process.env.NODE_ENV !== "production", // 开发环境自动同步数据库结构
  logging: process.env.NODE_ENV !== "production",
  entities: [User, SitesEntity, GroupsEntity, ConfigsEntity], // 注册所有实体
  migrations: [],
  subscribers: [],
  connectTimeout: 20000,
});

// 初始化数据库连接
export const initDatabase = async (): Promise<DataSource> => {
  // 如果已有数据源实例且已初始化，则直接返回
  if (
    global.dbConnection.dataSource &&
    global.dbConnection.dataSource.isInitialized
  ) {
    return global.dbConnection.dataSource;
  }

  // 如果已经有初始化中的Promise，则等待它完成
  if (global.dbConnection.promise) {
    return global.dbConnection.promise;
  }

  // 创建新的初始化Promise
  global.dbConnection.promise = (async () => {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log("数据库连接成功");
      }

      global.dbConnection.dataSource = AppDataSource;
      return AppDataSource;
    } catch (error) {
      console.error("数据库连接失败:", error);
      global.dbConnection.promise = null;
      throw error;
    }
  })();

  return global.dbConnection.promise;
};
