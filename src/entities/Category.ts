import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import Product from "./Product";
@Entity("category")
export class Category extends BaseEntity {
  constructor(category: Partial<Category>) {
    super();
    Object.assign(this, category);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  product: Product[];
}

export default Category;
