import { Category } from "../../../database/models/category.model.js";
import slugify from "slugify";
import { AppError } from "../../utils/appError.js"
import { catchError } from "../../middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";

const addCategory = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  req.body.image = req.file.filename;
  const category = new Category(req.body);
  await category.save();
  res.json({ message: "success", category });
});

const allCategories = catchError(async (req, res, next) => {
  const categories = await Category.find();
  res.json({ message: "success", categories });
});

const getCategory = catchError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  category || next(new AppError("Category not found", 404));
  !category || res.json({ message: "success", category });
});

const updateCategory = catchError(async (req, res, next) => {
  if(req.body.slug) req.body.slug = slugify(req.body.name);
  if(req.file) req.body.image = req.file.filename;
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  category || next(new AppError("Category not found", 404));
  !category || res.json({ message: "success", category });
});

const deleteCategory = deleteOne(Category);

export {
  addCategory,
  allCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
