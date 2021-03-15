import { Request, Response } from "express";
import { getRepository } from "typeorm";
import jwt from "jsonwebtoken";
import { validate } from "class-validator";
import Cart from "../entities/Cart";
import User from "../entities/User";

class UserController {
  static create = async (req: Request, res: Response) => {
    let userParams = req.body;
    const cartRepository = getRepository(Cart);
    try {
      const user = new User(userParams);
      const errors = await validate(user);

      user.fullName = userParams.lastName + " " + userParams.firstName;

      if (errors.length) {
        res.status(400).json(errors);
        return;
      }

      user.generateRefreshToken();
      user.hashPassword();
      user
        .save()
        .then((user) => {
          const cart = cartRepository.create();
          cart.user = user;

          cartRepository
            .save(cart)
            .then()
            .catch((err) => res.json(err));

          const status = {
            message: "Create User Successfully !!",
          };

          res.json(status);
        })
        .catch((err) => res.json(err));
    } catch (error) {
      const status = {
        message: "Create User Fail !!",
      };

      res.status(400).json(status);
    }
  };

  static getAllUser = async (req: Request, res: Response) => {
    try {
      let user = await User.find();
      res.json(user);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  static getUserProfile = (req: Request, res: Response) => {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
      if (err) {
        res.status(401).json(err);
      } else {
        const userId = decodedToken._id;
        User.findOne(userId)
          .then((user) => {
            delete user.password;
            res.json(user);
          })
          .catch((err) => res.status(401).json(err));
      }
    });
  };

  static deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(userId);

    if (user) {
      userRepository
        .delete(userId)
        .then(() => {
          const status = {
            message: "Delete User Successfully !!",
          };

          res.json(status);
        })
        .catch((err) => res.json(err));
    } else {
      const status = {
        message: "No User Found !!",
      };

      res.status(404).json(status);
    }
  };

  static editUser = async (req: Request, res: Response) => {
    const userParams = req.body;
    const { userId } = res.locals;
    const userRepository = getRepository(User);
    let user = await userRepository.findOne(userId);

    if (user) {
      user.email = userParams.email;
      user.phoneNumber = userParams.phoneNumber;
      user.firstName = userParams.firstName;
      user.lastName = userParams.lastName;
      user.fullName = userParams.lastName + " " + userParams.firstName;
      user.birthDay = userParams.birthDay;
      userRepository
        .save(user)
        .then(() => {
          const status = {
            message: "Update User Successfully !!",
          };

          res.json(status);
        })
        .catch((err) => res.json(err));
    } else {
      const status = {
        message: "No User Found !!",
      };

      res.status(404).json(status);
    }
  };
}

export default UserController;
