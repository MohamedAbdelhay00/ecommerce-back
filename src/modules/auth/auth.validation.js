import Joi from "joi";

export const signupVal = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").optional(),
  image: Joi.any().optional(),
});

export const signinVal = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  image: Joi.any().optional(),
});

export const changePasswordVal = Joi.object({
  password: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  image: Joi.any().optional(),
});
