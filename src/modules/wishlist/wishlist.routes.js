import { Router } from "express";
import { addBrand, allBrands, deleteBrand, getBrand, updateBrand } from "./brand.controller.js";
import { addToWishlist, gotLoggedUserWishlist, removeFromWishlist } from "./wishlist.controller.js";
import { allowedTo, protectedRoute } from "../auth/auth.controller.js";


const wishlistRouter = Router();

wishlistRouter.route("/")
  .patch(protectedRoute, allowedTo('user'), addToWishlist)
  .get(protectedRoute, allowedTo('user'), gotLoggedUserWishlist);

wishlistRouter.route("/:id")
.delete(protectedRoute, allowedTo('user'), removeFromWishlist)

export default wishlistRouter;
