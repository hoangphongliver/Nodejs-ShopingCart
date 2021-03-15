import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import bcrypt from "bcryptjs";
import { Length, IsNotEmpty, IsEmail } from "class-validator";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import Role from "./Role";
@Entity("users")
export class User extends BaseEntity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Length(6, 30)
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  fullName: string;

  @Column()
  birthDay: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  phoneNumber: number;

  @Column()
  @Length(6, 20)
  password: string;

  @Column()
  refreshToken: string;

  @OneToMany((type) => Role, (role) => role.user)
  roles: Role[];

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  generateRefreshToken() {
    const refreshToken = jwt.sign(
      { id: this.id, username: this.username },
      process.env.JWT_KEY,
      { expiresIn: "1y" }
    );

    this.refreshToken = refreshToken;
  }

  generateToken() {
    const token = jwt.sign(
      { id: this.id, username: this.username },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    return {
      accessToken: token,
      exprireInFormat: dayjs(Math.floor(Date.now()) + 1 * 60 * 1000).format(
        "DD-MM-YYYY HH:mm:ss"
      ),
      exprireIn: Math.floor(Date.now()) + 1 * 60 * 1000,
    };
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}

export default User;
