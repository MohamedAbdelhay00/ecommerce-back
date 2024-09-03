import { Router } from "express";
import { addUser, allUsers, deleteUser, getUser, updateUser } from "./user.controller.js";
import { validate } from "./validation.js";
import { userValidationSchema, updateUserValidationSchema } from "./user.validation.js";
import { checkEmail } from "../../middleware/checkEmail.js";

const userRouter = Router();

userRouter.route("/")
  .post(checkEmail, validate(userValidationSchema), addUser)  // Validate data on user creation
  .get(allUsers);

userRouter.route("/:id")
  .get(getUser)
  .put(checkEmail, validate(updateUserValidationSchema), updateUser)  // Validate data on user update
  .delete(deleteUser);

export default userRouter;
