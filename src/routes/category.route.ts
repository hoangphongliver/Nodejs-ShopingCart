import { Router } from "express";
import CategoryController from "../controllers/category.controller";
import auth from "../middlewares/auth.middleware";
const router = Router();

router.post("/create", auth, CategoryController.create);
router.get("/", CategoryController.getAllCategoris);
router.get("/:categoryId", auth, CategoryController.getProductById);
router.delete("/delete/:id", auth, CategoryController.delete);
router.put("/update", auth, CategoryController.update);

export default router;
