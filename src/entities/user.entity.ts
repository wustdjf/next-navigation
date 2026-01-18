import { Exclude } from "class-transformer";
import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import * as bcrypt from "bcryptjs";
import { IsEmail, IsOptional } from "class-validator";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, comment: "用户名" })
  username: string;

  @Column({ default: null, comment: "用户昵称" })
  nickname: string;

  @Exclude()
  @Column({ select: false, comment: "密码" })
  password: string;

  @Column({ default: null, comment: "图像" })
  avatar: string;

  @Column({ default: null, comment: "邮箱" })
  @IsOptional()
  @IsEmail()
  email: string;

  @CreateDateColumn({
    type: "timestamp",
    comment: "创建时间",
    name: "created_at",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    comment: "更新时间",
    name: "updated_at",
  })
  updated_at: Date;

  @BeforeInsert()
  async encryptPwd() {
    try {
      if (!this.password) {
        console.log("密码为空，跳过加密");
        return;
      }
      console.log("开始加密密码...");
      this.password = bcrypt.hashSync(this.password, 10);
      console.log("密码加密完成");
    } catch (error) {
      console.error("密码加密失败:", error);
      throw error;
    }
  }

  @Column({ default: 0 })
  tokenVersion: number; // 新增token版本号
}
