import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import auth from "../middlewares/auth.middleware";

const router = Router();

//Login route
router.post("/login", AuthController.login);
router.post("/changePassword", auth, AuthController.changePassword);
router.post("/refreshToken", AuthController.refreshToken);

export default router;
