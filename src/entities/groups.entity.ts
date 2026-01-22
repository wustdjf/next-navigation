import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("groups")
export class GroupsEntity {
  @PrimaryGeneratedColumn({ comment: "分组ID" })
  id: number;

  @Column({ type: "varchar", comment: "分组名称" })
  name: string;

  @Column({ type: "int", default: 0, comment: "分组排序" })
  order_num: number;

  @OneToMany("SitesEntity", "group")
  sites: any[];

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
