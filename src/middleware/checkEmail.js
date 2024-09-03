import { User } from "../../database/models/user.model.js";
import { AppError } from "../utils/appError.js";

export const checkEmail = async (req, res, next) => {
  try {
    // Find the user with the email provided in the request body
    let isExist = await User.findOne({ email: req.body.email });

    // If the email already exists in the database, return an error
    if (isExist) {
      return next(new AppError("Email already exists", 409));
    }

    // If the email does not exist, proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle any unexpected errors
    next(error);
  }
};
