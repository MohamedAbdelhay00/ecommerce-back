import { AppError } from "../utils/appError";

export const validate = (schema) => {
  return async (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (!error) {
      next();
    } else {
      const errMsg = error.details.map((e) => e.message).join(", ");
      next(new AppError(errMsg, 401));
    }
  };
};
