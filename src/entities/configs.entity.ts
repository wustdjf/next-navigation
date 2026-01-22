import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("configs")
export class ConfigsEntity {
  @PrimaryColumn({ type: "varchar", comment: "配置key" })
  key: string;

  @Column({ type: "varchar", comment: "配置value" })
  value: string;

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
}
