import { Router } from "express";
import auth from "./auth.route";
import user from "./user.route";
import product from "./product.route";
import cart from "./cart.route"
import category from "./category.route"

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/product", product);
routes.use("/cart", cart);
routes.use("/category", category);

export default routes;
