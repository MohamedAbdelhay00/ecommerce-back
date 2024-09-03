import { Router } from "express";
import {
  addCategory,
  allCategories,
  deleteCategory,
  getCategory,
  updateCategory,
} from "./category.controller.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import subCategoryRouter from "../subCategory/subCategory.routes.js";
import { validate } from "../../middleware/validate.js";
import { addCategoryValidation } from "./category.validation.js";

const categoryRouter = Router();
categoryRouter.route("/").post(uploadSingleFile('image', 'categories'), validate(addCategoryValidation), addCategory).get(allCategories);
categoryRouter.use("/:category/sub-categories", subCategoryRouter)
categoryRouter
  .route("/:id")
  .get(getCategory)
  .put(uploadSingleFile('image', 'categories'), validate(addCategoryValidation), updateCategory)
  .delete(deleteCategory);

export default categoryRouter;
