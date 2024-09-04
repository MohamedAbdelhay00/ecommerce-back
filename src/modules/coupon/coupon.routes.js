import { Router } from "express";
import { addCoupon, allCoupons, deleteCoupon, getCoupon, updateCoupon } from "./coupon.controller.js";
import { allowedTo, protectedRoute } from "../auth/auth.controller.js";


const couponRouter = Router();

couponRouter.route("/")
  .post(protectedRoute, allowedTo('admin'), addCoupon)
  .get(protectedRoute, allowedTo('admin'), allCoupons);

couponRouter.route("/:id")
  .get(protectedRoute, allowedTo('admin'), getCoupon)
  .put(protectedRoute, allowedTo('admin'), updateCoupon)
  .delete(protectedRoute, allowedTo('admin'), deleteCoupon);

export default couponRouter;
