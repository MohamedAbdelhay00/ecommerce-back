import Router from "express";
import { validate } from "../../middleware/validate.js";
import { checkEmail } from "../../middleware/checkEmail.js";
import { changePassword, protectedRoute, signin, signup } from "./auth.controller.js";
import { changePasswordVal, signinVal, signupVal } from "./auth.validation.js";

const authRouter = Router();
authRouter.post("/signup", validate(signupVal), checkEmail, signup);
authRouter.post("/signin", validate(signinVal), signin);
authRouter.patch("/change-password", protectedRoute, validate(changePasswordVal), changePassword);

export default authRouter;