import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  JoinColumn,
  OneToOne,
} from "typeorm";
import User from "./User";
import CartItem from "./CartItem";

@Entity("cart")
export class Cart extends BaseEntity {
  constructor() {
    super();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @OneToMany((type) => CartItem, (cartItem) => cartItem.cart)
  @JoinColumn()
  cartItem: CartItem[];
}

export default Cart;
