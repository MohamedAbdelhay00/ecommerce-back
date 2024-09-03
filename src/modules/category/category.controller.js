import { Category } from "../../../database/models/category.model.js";
import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";
import fs from "fs";
import path from "path";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const addCategory = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  req.body.image = req.file.filename;
  const category = new Category(req.body);
  await category.save();
  res.json({ message: "success", category });
});

const allCategories = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Category.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();
  const categories = await apiFeatures.mongooseQuery;
  res.json({ message: "success", page: apiFeatures.pageNumber, categories });
});

const getCategory = catchError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  category || next(new AppError("Category not found", 404));
  !category || res.json({ message: "success", category });
});

const updateCategory = catchError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  if (req.file) {
    const oldImageFilename = category.image.split("/").pop();
    const oldImagePath = path.resolve(
      "uploads",
      "categories",
      oldImageFilename
    );
    console.log("Attempting to delete old image at:", oldImagePath);

    fs.access(oldImagePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("Old image does not exist:", oldImagePath);
      } else {
        fs.unlink(oldImagePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete old image:", unlinkErr);
          } else {
            console.log("Old image deleted successfully:", oldImagePath);
          }
        });
      }
    });

    req.body.image = req.file.filename;
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.json({ message: "success", category: updatedCategory });
});

const deleteCategory = deleteOne(Category);

export {
  addCategory,
  allCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
