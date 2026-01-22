import "reflect-metadata";
import { DataSource } from "typeorm";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { User } from "./src/entities/user.entity";
import { GroupsEntity } from "./src/entities/groups.entity";
import { SitesEntity } from "./src/entities/sites.entity";
import { ConfigsEntity } from "./src/entities/configs.entity";

// 加载环境变量
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建数据源
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWD || "password",
  database: process.env.DB_DATABASE || "navigationDB",
  entities: [User, GroupsEntity, SitesEntity, ConfigsEntity],
  migrations: [path.join(__dirname, "src/migrations/**/*.ts")],
  migrationsTableName: "migrations",
  logging: false,
  synchronize: false,
  cli: {
    migrationsDir: "src/migrations"
  }
});

