import { Category } from "../../../database/models/category.model.js";
import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";
import fs from "fs";
import path from "path";

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

// const updateCategory = catchError(async (req, res, next) => {
//   if(req.body.slug) req.body.slug = slugify(req.body.name);
//   if(req.file) req.body.image = req.file.filename;
//   const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   category || next(new AppError("Category not found", 404));
//   !category || res.json({ message: "success", category });
// });

const updateCategory = catchError(async (req, res, next) => {
  // Find the category first to get the old image filename
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  // Update slug if the name is changed
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  // If a new file is uploaded, delete the old image
  if (req.file) {
    // Extract the filename from the URL
    const oldImageFilename = category.image.split('/').pop();
    const oldImagePath = path.resolve('uploads', 'categories', oldImageFilename);
    console.log('Attempting to delete old image at:', oldImagePath);

    fs.access(oldImagePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('Old image does not exist:', oldImagePath);
      } else {
        fs.unlink(oldImagePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Failed to delete old image:', unlinkErr);
          } else {
            console.log('Old image deleted successfully:', oldImagePath);
          }
        });
      }
    });

    req.body.image = req.file.filename;
  }

  // Update the category with the new data
  const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

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
