import Joi from "joi";

// Schema for validating user creation and updates
const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  isBlocked: Joi.boolean().optional(),
  role: Joi.string().valid("user", "admin").default("user").optional(),
});

// Separate schema for user updates, where all fields are optional
const updateUserValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  isBlocked: Joi.boolean().optional(),
  role: Joi.string().valid("user", "admin").optional(),
  image: Joi.any().optional(),  
});

export { userValidationSchema, updateUserValidationSchema };
