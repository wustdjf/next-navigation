import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity("sites")
export class SitesEntity {
  @PrimaryGeneratedColumn({ comment: "站点ID" })
  id: number;

  @Column({ type: "int", comment: "分组ID" })
  group_id: number;

  @ManyToOne("GroupsEntity", "sites", {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "group_id" })
  group: any;

  @Column({ type: "varchar", comment: "站点名称" })
  name: string;

  @Column({ type: "varchar", comment: "站点url" })
  url: string;

  @Column({ type: "varchar", nullable: true, comment: "站点图标" })
  icon: string;

  @Column({ type: "varchar", nullable: true, comment: "站点简介" })
  description: string;

  @Column({ type: "varchar", nullable: true, comment: "站点描述" })
  notes: string;

  @Column({ type: "int", comment: "站点排序" })
  order_num: number;

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
