import Joi from "joi";

const addToCartValidation = Joi.object({
  product: Joi.string().required().messages({
    "string.empty": "Product ID is required.",
    "any.required": "Product ID is required.",
  }),
  quantity: Joi.number().integer().min(1).optional().messages({
    "number.base": "Quantity must be a valid number.",
    "number.min": "Quantity must be at least 1.",
  }),
  image: Joi.string().optional(),
});

const updateQuantityValidation = Joi.object({
    id: Joi.string().required().messages({
      "string.base": "ID must be a valid string.",
      "any.required": "ID is required.",
    }),
    quantity: Joi.number().integer().min(1).required().messages({
      "number.base": "Quantity must be a valid number.",
      "number.min": "Quantity must be at least 1.",
      "any.required": "Quantity is required.",
    }),
    image: Joi.string().optional(),
  });

const applyCouponValidation = Joi.object({
  code: Joi.string().required().messages({
    "string.empty": "Coupon code is required.",
    "any.required": "Coupon code is required.",
  }),
  image: Joi.string().optional(),
});

export {
  addToCartValidation,
  updateQuantityValidation,
  applyCouponValidation,
};
