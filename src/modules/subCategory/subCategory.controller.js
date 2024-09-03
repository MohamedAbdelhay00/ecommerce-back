import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { SubCategory } from "../../../database/models/subCategory.model.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const addSubCategory = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  const subCategory = new SubCategory(req.body);
  await subCategory.save();
  res.json({ message: "success", subCategory });
});

const allSubCategories = catchError(async (req, res, next) => {
  let filterObj = {};
  if (req.params.category) {
    filterObj.category = req.query.category;
  }
  let apiFeatures = new ApiFeatures(SubCategory.find(filterObj), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();
  const categories = await apiFeatures.mongooseQuery;
  res.json({ message: "success", page: apiFeatures.pageNumber, categories });
});

const getSubCategory = catchError(async (req, res, next) => {
  const subCategory = await SubCategory.findById(req.params.id);
  subCategory || next(new AppError("Sub category not found", 404));
  !subCategory || res.json({ message: "success", subCategory });
});

const updateSubCategory = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  const subCategory = await SubCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  subCategory || next(new AppError("Sub category not found", 404));
  !subCategory || res.json({ message: "success", subCategory });
});

const deleteSubCategory = deleteOne(SubCategory);
export {
  addSubCategory,
  allSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
