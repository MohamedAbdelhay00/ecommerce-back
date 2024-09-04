import Joi from "joi";

const addAddressValidation = Joi.object({
    city: Joi.string().min(1).max(50).required(),
    street: Joi.string().min(1).max(100).required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    image: Joi.string().uri().optional(),
  });

const removeAddressValidation = Joi.object({
  addressId: Joi.string().required(),
});

export { addAddressValidation, removeAddressValidation };
