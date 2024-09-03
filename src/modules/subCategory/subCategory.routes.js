import { Router } from "express";
import { addSubCategory, allSubCategories, deleteSubCategory, getSubCategory, updateSubCategory } from "./subCategory.controller.js";


const subCategoryRouter = Router({ mergeParams: true });
subCategoryRouter.route("/").post(addSubCategory).get(allSubCategories);
subCategoryRouter.route("/:id").get(getSubCategory).put(updateSubCategory).delete(deleteSubCategory);

export default subCategoryRouter;
