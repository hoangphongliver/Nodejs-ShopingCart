const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
      if (err) {
        res.status(401).json(err);
      } else {      
        res.locals.userId = decodedToken.id
        res.locals.username = decodedToken.username
        next();
      }
    });
  } catch {
    res.status(401).json({
      error: "You have not permisson to access !!",
    });
  }
};

export default auth;
