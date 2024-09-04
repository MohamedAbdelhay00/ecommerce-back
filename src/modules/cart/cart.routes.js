import { Router } from "express";
import { allowedTo, protectedRoute } from "../auth/auth.controller.js";
import { addToCart, applyCoupon, clearUserCart, getLoggedUserCart, removeItemFromCart, updateQuantity } from "./cart.controller.js";
import { validate } from "../../middleware/validate.js";
import { addToCartValidation, updateQuantityValidation, applyCouponValidation } from "./cart.validation.js";


const cartRouter = Router();

cartRouter.route("/")
  .post(protectedRoute, allowedTo('user', 'admin'), validate(addToCartValidation), addToCart)
  .get(protectedRoute, allowedTo('user', 'admin'), getLoggedUserCart)
  .delete(protectedRoute, allowedTo('user', 'admin'), clearUserCart);

cartRouter.route("/:id")
  .put(protectedRoute, allowedTo('user', 'admin'), validate(updateQuantityValidation), updateQuantity)
  .delete(protectedRoute, allowedTo('user', 'admin'), removeItemFromCart);

cartRouter.post('/apply-coupon', protectedRoute, allowedTo('user', 'admin'), validate(applyCouponValidation), applyCoupon);

export default cartRouter;
