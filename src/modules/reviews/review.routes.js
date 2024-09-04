import { Router } from "express";
import { addReview, allReviews, deleteReview, getReview, updateReview } from "./review.controller.js";
import { allowedTo, protectedRoute } from "../auth/auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { addReviewValidation, updateReviewValidation } from "./review.validation.js";

const reviewRouter = Router();

reviewRouter.route("/")
  .post(protectedRoute, allowedTo('user'), validate(addReviewValidation), addReview)
  .get(allReviews);

reviewRouter.route("/:id")
  .get(getReview)
  .put(protectedRoute, allowedTo('user'), validate(updateReviewValidation), updateReview)
  .delete(protectedRoute, allowedTo('user', 'admin'), deleteReview);

export default reviewRouter;
