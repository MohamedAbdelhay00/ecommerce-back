import { Router } from "express";
import { addToWishlist, gotLoggedUserWishlist, removeFromWishlist } from "./wishlist.controller.js";
import { allowedTo, protectedRoute } from "../auth/auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { addToWishlistValidation } from "./wishlist.validation.js";

const wishlistRouter = Router();

wishlistRouter.route("/")
  .patch(protectedRoute, allowedTo('user', 'admin'), validate(addToWishlistValidation), addToWishlist)
  .get(protectedRoute, allowedTo('user', 'admin'), gotLoggedUserWishlist);

wishlistRouter.route("/:id")
  .delete(protectedRoute, allowedTo('user', 'admin'), removeFromWishlist);

export default wishlistRouter;
