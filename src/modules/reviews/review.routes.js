import { Router } from "express";
import { addReview, allReviews, deleteReview, getReview, updateReview } from "./review.controller.js";
import { allowedTo, protectedRoute } from "../auth/auth.controller.js";
const reviewRouter = Router();

reviewRouter.route("/")
  .post(protectedRoute, allowedTo('user'), addReview)
  .get(allReviews);

reviewRouter.route("/:id")
  .get(getReview)
  .put(protectedRoute, allowedTo('user'), updateReview)
  .delete(protectedRoute, allowedTo('user', 'admin'), deleteReview);

export default reviewRouter;
