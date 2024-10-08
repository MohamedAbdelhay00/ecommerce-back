import slugify from "slugify";
import { AppError } from "../../utils/appError.js"
import { catchError } from "../../middleware/catchError.js";
import { Brand } from "../../../database/models/brand.model.js";
import { deleteOne } from "../handlers/handlers.js";
import fs from 'fs';
import path from 'path';

const addBrand = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  req.body.image = req.file.filename;
  const brand = new Brand(req.body);
  await brand.save();
  res.json({ message: "success", brand });
});

const allBrands = catchError(async (req, res, next) => {
  const brands = await Brand.find();
  res.json({ message: "success", brands });
});

const getBrand = catchError(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  brand || next(new AppError("Brand not found", 404));
  !brand || res.json({ message: "success", brand });
});

const updateBrand = catchError(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return next(new AppError("Brand not found", 404));
  }

  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  if (req.file) {
    const oldLogoFilename = brand.image.split('/').pop();
    const oldLogoPath = path.resolve('uploads', 'brands', oldLogoFilename);
    console.log('Attempting to delete old logo at:', oldLogoPath);

    fs.access(oldLogoPath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('Old logo does not exist:', oldLogoPath);
      } else {
        fs.unlink(oldLogoPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Failed to delete old logo:', unlinkErr);
          } else {
            console.log('Old logo deleted successfully:', oldLogoPath);
          }
        });
      }
    });

    req.body.image = req.file.filename;
  }

  const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ message: "success", brand: updatedBrand });
});


const deleteBrand = deleteOne(Brand);

export {
  addBrand,
  allBrands,
  getBrand,
  updateBrand,
  deleteBrand,
};
