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

const categoryRouter = Router();
categoryRouter.route("/").post(uploadSingleFile('image', 'categories'), addCategory).get(allCategories);
categoryRouter.use("/:category/sub-categories", subCategoryRouter)
categoryRouter
  .route("/:id")
  .get(getCategory)
  .put(uploadSingleFile('image', 'categories'), updateCategory)
  .delete(deleteCategory);

export default categoryRouter;
