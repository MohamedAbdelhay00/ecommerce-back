import Joi from "joi";
import { AppError } from "../../utils/appError.js";

const addReviewValidation = Joi.object({
  comment: Joi.string().allow('').optional().messages({
    "string.base": "Comment must be a string.",
  }),
  rate: Joi.number().min(1).max(5).optional().messages({
    "number.base": "Rate must be a number between 1 and 5.",
    "number.min": "Rate must be at least 1.",
    "number.max": "Rate cannot exceed 5.",
  }),
  image: Joi.string().optional(),
  id: Joi.string().optional(),
}).unknown(true);

const updateReviewValidation = Joi.object({
  comment: Joi.string().allow('').optional().messages({
    "string.base": "Comment must be a string.",
  }),
  rate: Joi.number().min(1).max(5).optional().messages({
    "number.base": "Rate must be a number between 1 and 5.",
    "number.min": "Rate must be at least 1.",
    "number.max": "Rate cannot exceed 5.",
  }),
  image: Joi.string().optional(),
  id: Joi.string().optional(),
}).unknown(true);

export { addReviewValidation, updateReviewValidation };