import { Router } from "express";
import { addBrand, allBrands, deleteBrand, getBrand, updateBrand } from "./brand.controller.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import { validate } from "./validation.js";
import { addBrandValidation } from "./brand.validation.js";

const brandRouter = Router();

brandRouter.route("/")
  .post(uploadSingleFile('image', 'brands'), validate(addBrandValidation), addBrand)
  .get(allBrands);

brandRouter.route("/:id")
  .get(getBrand)
  .put(uploadSingleFile('image', 'brands'), validate(addBrandValidation), updateBrand)
  .delete(deleteBrand);

export default brandRouter;
