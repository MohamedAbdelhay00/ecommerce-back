import slugify from "slugify";
import { AppError } from "../../utils/appError.js"
import { catchError } from "../../middleware/catchError.js";
import { Product } from "../../../database/models/product.model.js";
import { deleteOne } from "../handlers/handlers.js";

const addProduct = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  req.body.imageCover = req.files.imageCover[0].filename;
  req.body.images = req.files.images.map(img=>img.filename);
  const product = new Product(req.body);
  await product.save();
  res.json({ message: "success", product });
});

const allProducts = catchError(async (req, res, next) => {
  let pageNumber = req.query.page * 1 || 1;
  if(req.query.page < 1) pageNumber = 1;
  const limit = 1;
  let skip  =(parseInt(pageNumber) -1) * limit;
  const product = await Product.find().skip(skip).limit(limit);
  res.json({ message: "success", pageNumber, product });
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

const deleteProduct = deleteOne(Product);

export {
  addProduct,
  allProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
