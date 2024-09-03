import Joi from "joi";

const productValidationSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  price: Joi.number().min(0).required(),
  priceAfterDiscount: Joi.number().min(0).optional(),
  description: Joi.string().min(20).max(2000).required(),
  category: Joi.string().required(),
  subCategory: Joi.string().optional(),
  brand: Joi.string().optional(),
  imageCover: Joi.any().optional(), // To allow file upload for imageCover
  images: Joi.any().optional(),     // To allow file upload for images
});

export { productValidationSchema };
