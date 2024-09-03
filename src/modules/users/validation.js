import { AppError } from "../../utils/appError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errMsg = error.details.map((e) => e.message).join(", ");
      return next(new AppError(errMsg, 401));
    }

    next();
  };
};
