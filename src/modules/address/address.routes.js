import { Router } from "express";
import { allowedTo, protectedRoute } from "../auth/auth.controller.js";
import { addToAddress, gotLoggedUserAddress, removeAddress } from "./address.controller.js";
import { validate } from "../../middleware/validate.js";
import { addAddressValidation } from "./address.validation.js";

const addressRouter = Router();

addressRouter.route("/")
  .patch(
    protectedRoute, 
    allowedTo('user'), 
    validate(addAddressValidation),
    addToAddress
  )
  .get(protectedRoute, allowedTo('user'), gotLoggedUserAddress);

addressRouter.route("/:id")
  .delete(protectedRoute, allowedTo('user', 'admin'), removeAddress);

export default addressRouter;
