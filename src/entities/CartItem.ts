import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Column,
  JoinColumn,
} from "typeorm";
import Cart from "./Cart";
import Product from "./Product";

@Entity("cart_item")
export class CartItem extends BaseEntity {
  constructor() {
    super();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne((type) => Cart, (cart) => cart.id)
  cart: Cart;

  @ManyToOne((type) => Product, (product) => product)
  @JoinColumn()
  product: Product;

}

export default CartItem;
