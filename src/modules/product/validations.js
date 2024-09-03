import { AppError } from "../../utils/appError.js";

export const validate = (schema) => {
  return async (req, res, next) => {
    // Validate form data
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errMsg = error.details.map((e) => e.message).join(", ");
      return next(new AppError(errMsg, 401));
    }

    // Validate the uploaded files if they exist
    if (req.files) {
      const { imageCover, images } = req.files;

      if (imageCover && imageCover[0].mimetype) {
        const allowedMimetypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
        if (!allowedMimetypes.includes(imageCover[0].mimetype)) {
          return next(new AppError("Invalid file type for imageCover", 400));
        }
      }

      if (images) {
        for (let image of images) {
          if (image.mimetype) {
            const allowedMimetypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
            if (!allowedMimetypes.includes(image.mimetype)) {
              return next(new AppError("Invalid file type for images", 400));
            }
          }
        }
      }
    }

    next();
  };
};
