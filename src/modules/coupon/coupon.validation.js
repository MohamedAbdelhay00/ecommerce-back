import Joi from "joi";

const addBrandValidation = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  image: Joi.any().optional(),
});

export { addBrandValidation };
