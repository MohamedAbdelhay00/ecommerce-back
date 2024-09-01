import slugify from "slugify";
import { AppError } from "../../utils/appError.js"
import { catchError } from "../../middleware/catchError.js";
import { Brand } from "../../../database/models/brand.model.js";

const addBrand = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
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
  req.body.slug = slugify(req.body.name);
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  brand || next(new AppError("Brand not found", 404));
  !brand || res.json({ message: "success", brand });
});

const deleteBrand = catchError(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  brand || next(new AppError("Brand not found", 404));
  !brand || res.json({ message: "success", brand });
});

export {
  addBrand,
  allBrands,
  getBrand,
  updateBrand,
  deleteBrand,
};
