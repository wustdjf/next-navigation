import "reflect-metadata";
import { DataSource } from "typeorm";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from 'url';

// 加载环境变量
dotenv.config();

const __filename = fileURLToPath(import.meta.url);


// 创建数据源
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWD || "password",
  database: process.env.DB_DATABASE || "navigationDB",
  entities: [path.join(path.dirname(__filename), "src/entities/**/*.entity.{ts,js}")],
  migrations: [path.join(path.dirname(__filename), "src/migrations/**/*.{ts,js}")],
  migrationsTableName: "migrations",
  logging: true,
  synchronize: false // 迁移时禁用同步
});

