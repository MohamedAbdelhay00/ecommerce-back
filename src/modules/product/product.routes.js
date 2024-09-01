import { Router } from "express";
import { addProduct, allProducts, deleteProduct, getProduct, updateProduct } from "./product.controller.js";

const brandRouter = Router();
brandRouter.route("/").post(addProduct).get(allProducts);
brandRouter.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);

export default brandRouter;
