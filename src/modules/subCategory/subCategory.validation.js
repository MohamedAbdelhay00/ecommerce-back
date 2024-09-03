import Joi from "joi";

const addSubCategoryValidation = Joi.object({
  name: Joi.string().min(1).max(50).required(),
});

export { addSubCategoryValidation };
