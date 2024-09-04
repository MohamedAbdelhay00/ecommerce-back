import Joi from "joi";

const createCashOrderValidation = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "ID must be a valid string.",
    "any.required": "ID is required.",
  }),
  shippingAddress: Joi.string().optional(), // Corrected spelling
  image: Joi.string().optional(),
  // Add other fields as necessary
}).unknown(true); // Allow unknown fields

const createCheckoutSessionValidation = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "ID must be a valid string.",
    "any.required": "ID is required.",
  }),
  shippingAddress: Joi.string().optional(), // Corrected spelling
  image: Joi.string().optional(),
  // Add other fields as necessary
}).unknown(true); // Allow unknown fields

export { createCashOrderValidation, createCheckoutSessionValidation };