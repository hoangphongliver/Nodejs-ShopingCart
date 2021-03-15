import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import Category from "./Category";

@Entity("products")
export class Product extends BaseEntity {
  constructor(product: Partial<Product>) {
    super();
    Object.assign(this, product);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  image: string;

  @ManyToOne(() => Category, (category) => category.product)
  category: Category;
}

export default Product;
