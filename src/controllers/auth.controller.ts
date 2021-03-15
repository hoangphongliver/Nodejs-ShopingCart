import { Request, Response } from "express";
import { getRepository } from "typeorm";
import jwt from "jsonwebtoken";
const bcrypt = require("bcryptjs");
import User from "../entities/User";
import { validate } from "class-validator";

class AuthController {
  static login = async (req: Request, res: Response) => {
    let { username, password } = req.body;
    if (!(username && password)) {
      const status = {
        message: "Username or password must be have value !!",
      };
      res.status(400).json(status);

      return;
    }

    const userRepository = getRepository(User);

    let user: User;
    user =
      (await userRepository.findOne({ username })) ||
      (await userRepository.findOne({ email: username })) ||
      (await userRepository.findOne({ phoneNumber: username }));

    if (!user) {
      const status = {
        message: "Username is not existed !!",
      };
      res.status(404).json(status);

      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      const status = {
        message: "Username or password not existed !!",
      };
      res.status(404).json(status);

      return;
    }

    if (user && isPasswordMatch) {
      const token = user.generateToken();
      delete user.password;

      const response = {
        ...token,
        ...user,
      };

      res.json(response);
    }
  };

  static refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    jwt.verify(refreshToken, process.env.JWT_KEY, async (err, decodedToken) => {
      if (!err) {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({
          username: decodedToken.username,
        });

        if (user) {
          const token = user.generateToken();
          res.json({
            ...token,
          });
        }
      } else {
        res.status(400).json(err);
      }
    });
  };

  static changePassword = (req: Request, res: Response) => {
    let { oldPassword, newPassword } = req.body;
    const userRepository = getRepository(User);

    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
      if (err) {
        res.status(401).json(err);
      } else {
        const userId = decodedToken.id;
        const user = await userRepository.findOne(userId);

        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
          const status = {
            message: "Password Invalid !!",
          };
          res.json(status);
          return;
        }

        user.password = newPassword;

        const errors = await validate(user);
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        }

        user.hashPassword();
        userRepository
          .save(user)
          .then(() => {
            const status = {
              message: "Changed Password Successfully !!",
            };
            res.json(status);
          })
          .catch((err) => res.json(err));
      }
    });
  };
}

export default AuthController;
