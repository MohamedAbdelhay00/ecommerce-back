import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidation = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid Product ID");
  }
  return value;
};

const addToWishlistValidation = Joi.object({
  product: Joi.string().custom(objectIdValidation, "ObjectId validation").required(),
  image: Joi.string().uri().optional(),
});

const removeFromWishlistValidation = Joi.object({
  product: Joi.string().custom(objectIdValidation, "ObjectId validation").required(),
  image: Joi.string().uri().optional(),
});

export { addToWishlistValidation, removeFromWishlistValidation };
