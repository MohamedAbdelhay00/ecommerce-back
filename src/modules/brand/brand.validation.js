import Joi from "joi";

const addBrandValidation = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  image: Joi.any() // This allows the image field to be optional in the request
});

export { addBrandValidation };
