import { Router } from "express";
import CartController from "../controllers/cart.controller";
import auth from "../middlewares/auth.middleware";
const router = Router();

//Login route
router.post("/addToCart", auth, CartController.createAndAddToCart);
router.get("/getCartOfUser", auth, CartController.getCartById);
router.delete("/delete/:cartItemId", auth, CartController.deteleProductInCart);
router.delete("/deleteAll", auth, CartController.deteleAllProductInCart);
router.put("/edit", auth, CartController.editCart);

export default router;
