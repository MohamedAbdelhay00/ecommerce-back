import { Router } from "express";
import { allowedTo, protectedRoute } from "../auth/auth.controller.js";
import { createCashOrder, createCheckoutSession, getAllOrders, getUserOrders } from "./order.controller.js";
import { createCashOrderValidation, createCheckoutSessionValidation } from "./order.validation.js";
import { validate } from "../../middleware/validate.js";


const orderRouter = Router();

orderRouter.route("/")
  .get(protectedRoute, allowedTo('user', 'admin'), getAllOrders);

orderRouter.get('/users', protectedRoute, allowedTo('user', 'admin'), getUserOrders)

orderRouter.route("/:id")
  .post(protectedRoute, allowedTo('user', 'admin'), validate(createCashOrderValidation), createCashOrder);

orderRouter.post('/checkout/:id', protectedRoute, allowedTo('admin'), validate(createCheckoutSessionValidation), createCheckoutSession);

export default orderRouter;
