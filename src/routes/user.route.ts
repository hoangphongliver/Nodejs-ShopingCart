import { Router } from "express";
import UserController from "../controllers/user.controller";
import auth from "../middlewares/auth.middleware";
const router = Router();

router.post("/create", UserController.create);
router.get("/getAllUser", auth, UserController.getAllUser);
router.get("/getUserProfile", auth, UserController.getUserProfile);
router.delete("/delete/:id", auth, UserController.deleteUser);
router.put("/edit", auth, UserController.editUser);

export default router;
