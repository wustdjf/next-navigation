import "reflect-metadata";
import { createConnection } from "mysql2/promise";
import { AppDataSource } from "../typeorm.config";

async function createDatabaseIfNotExists() {
  try {
    const connection = await createConnection({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWD || "password",
    });

    const database = process.env.DB_DATABASE || "navigationDB";
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✓ 数据库 ${database} 已创建或已存在`);

    await connection.end();
  } catch (error) {
    console.error("✗ 创建数据库失败:", error);
    throw error;
  }
}

async function initializeDatabase() {
  try {
    console.log("开始初始化数据库...");
    console.log("数据库配置:", {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
    });

    // 先创建数据库
    await createDatabaseIfNotExists();

    if (!AppDataSource.isInitialized) {
      console.log("正在连接数据库...");
      await AppDataSource.initialize();
      console.log("✓ 数据库连接成功");
    }

    // 使用 queryRunner 直接创建表格
    console.log("正在创建数据库表格...");
    const queryRunner = AppDataSource.createQueryRunner();
    
    try {
      // 创建 user 表
      await queryRunner.createTable(
        new (await import("typeorm")).Table({
          name: "user",
          columns: [
            { name: "id", type: "varchar", isPrimary: true, isGenerated: true, generationStrategy: "uuid" },
            { name: "username", type: "varchar", isUnique: true },
            { name: "nickname", type: "varchar", isNullable: true },
            { name: "password", type: "varchar" },
            { name: "avatar", type: "varchar", isNullable: true },
            { name: "email", type: "varchar", isNullable: true },
            { name: "tokenVersion", type: "int", default: 0 },
            { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
            { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" },
          ],
        }),
        true
      );
      console.log("✓ user 表已创建");

      // 创建 groups 表
      await queryRunner.createTable(
        new (await import("typeorm")).Table({
          name: "groups",
          columns: [
            { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
            { name: "name", type: "varchar" },
            { name: "order_num", type: "int", default: 0 },
            { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
            { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" },
          ],
        }),
        true
      );
      console.log("✓ groups 表已创建");

      // 创建 sites 表
      await queryRunner.createTable(
        new (await import("typeorm")).Table({
          name: "sites",
          columns: [
            { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
            { name: "group_id", type: "int" },
            { name: "name", type: "varchar" },
            { name: "url", type: "varchar" },
            { name: "icon", type: "varchar", isNullable: true },
            { name: "description", type: "varchar", isNullable: true },
            { name: "notes", type: "varchar", isNullable: true },
            { name: "order_num", type: "int" },
            { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
            { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" },
          ],
          foreignKeys: [
            {
              columnNames: ["group_id"],
              referencedTableName: "groups",
              referencedColumnNames: ["id"],
              onDelete: "CASCADE",
            },
          ],
        }),
        true
      );
      console.log("✓ sites 表已创建");

      // 创建 configs 表
      await queryRunner.createTable(
        new (await import("typeorm")).Table({
          name: "configs",
          columns: [
            { name: "key", type: "varchar", isPrimary: true },
            { name: "value", type: "varchar" },
            { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
            { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" },
          ],
        }),
        true
      );
      console.log("✓ configs 表已创建");

    } finally {
      await queryRunner.release();
    }

    console.log("✓ 数据库表格已创建");

    await AppDataSource.destroy();
    console.log("✓ 数据库连接已关闭");
  } catch (error) {
    console.error("✗ 数据库初始化失败:", error);
    if (error instanceof Error) {
      console.error("错误信息:", error.message);
      console.error("错误堆栈:", error.stack);
    }
    process.exit(1);
  }
}

initializeDatabase();
