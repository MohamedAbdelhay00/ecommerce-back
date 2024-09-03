import { AppError } from "../utils/appError.js";

export const validate = (schema) => {
  return async (req, res, next) => {
    const { error } = schema.validate(
      { image: req.file, ...req.body, ...req.params, ...req.query },
      { abortEarly: false }
    );

    if (!error) {
      next();
    } else {
      const errMsg = error.details.map((e) => e.message).join(", ");
      next(new AppError(errMsg, 401));
    }
  };
};
