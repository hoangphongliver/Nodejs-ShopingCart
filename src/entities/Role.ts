import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
  } from "typeorm";
  import User from "./User";
  
  @Entity("roles")
  export class Role extends BaseEntity {
    constructor(role: Partial<Role>) {
      super();
      Object.assign(this, role);
    }
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    name: string;
  
    @Column()
    description: string;
  
    @Column()
    role: number;
  
    @ManyToOne(() => User, (user) => user.roles)
    user: User;
  }
  
  export default Role;
  