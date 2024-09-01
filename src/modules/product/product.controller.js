import slugify from "slugify";
import { AppError } from "../../utils/appError.js"
import { catchError } from "../../middleware/catchError.js";
import { Product } from "../../../database/models/product.model.js";

const addProduct = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  const product = new Product(req.body);
  await product.save();
  res.json({ message: "success", product });
});

const allProducts = catchError(async (req, res, next) => {
  const product = await Product.find();
  res.json({ message: "success", product });
});

const getProduct = catchError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  product || next(new AppError("Product not found", 404));
  !product || res.json({ message: "success", product });
});

const updateProduct = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  product || next(new AppError("Product not found", 404));
  !product || res.json({ message: "success", product });
});

const deleteProduct = catchError(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  product || next(new AppError("Product not found", 404));
  !product || res.json({ message: "success", product });
});

export {
  addProduct,
  allProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
