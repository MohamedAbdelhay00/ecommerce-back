import { AppError } from "../../utils/appError.js";

export const validate = (schema) => {
  return async (req, res, next) => {
    // Validate form data
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errMsg = error.details.map((e) => e.message).join(", ");
      return next(new AppError(errMsg, 401));
    }

    // Validate the uploaded file if it exists
    if (req.file) {
      const { mimetype, size } = req.file;
      const allowedMimetypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
      if (!allowedMimetypes.includes(mimetype)) {
        return next(new AppError("Invalid file type", 400));
      }
      if (size > 5242880) { // 5MB max file size
        return next(new AppError("File too large", 400));
      }
    }

    next();
  };
};

