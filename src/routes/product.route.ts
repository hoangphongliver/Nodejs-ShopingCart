import { Router } from "express";
import ProductController from "../controllers/product.controller";
import auth from "../middlewares/auth.middleware";
const router = Router();

router.post("/create", auth, ProductController.create);
router.get("/getAllProducts", ProductController.getAllProducts);
router.get("/getProductInCategory/:categoryId", ProductController.getProductByCategory);
router.get("/:productId", auth, ProductController.getProductById);
router.delete("/delete/:id", auth, ProductController.delete);
router.put("/update", auth, ProductController.update);

export default router;
