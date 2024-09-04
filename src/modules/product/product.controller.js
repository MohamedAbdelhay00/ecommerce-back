import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { Product } from "../../../database/models/product.model.js";
import { deleteOne } from "../handlers/handlers.js";
import fs from "fs";
import path from "path";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const addProduct = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  req.body.imageCover = req.files.imageCover[0].filename;
  req.body.images = req.files.images.map((img) => img.filename);
  const product = new Product(req.body);
  await product.save();
  res.json({ message: "success", product });
});

const allProducts = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Product.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();
  const product = await apiFeatures.mongooseQuery;
  res.json({ message: "success", page: apiFeatures.pageNumber, product });
});

const getProduct = catchError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  product || next(new AppError("Product not found", 404));
  !product || res.json({ message: "success", product });
});

const updateProduct = catchError(async (req, res, next) => {
  console.log("Incoming Request Data:", {
    body: req.body,
    file: req.file,
    files: req.files,
  });

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  console.log("Current product imageCover:", product.imageCover);

  if (req.files && req.files.imageCover) {
    console.log(
      "New imageCover file detected:",
      req.files.imageCover[0].filename
    );

    const oldImageCoverFilename = product.imageCover.split("/").pop();
    const oldImageCoverPath = path.resolve(
      "uploads",
      "products",
      oldImageCoverFilename
    );
    console.log("Attempting to delete old image cover at:", oldImageCoverPath);

    fs.access(oldImageCoverPath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("Old image cover does not exist:", oldImageCoverPath);
      } else {
        fs.unlink(oldImageCoverPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete old image cover:", unlinkErr);
          } else {
            console.log(
              "Old image cover deleted successfully:",
              oldImageCoverPath
            );
          }
        });
      }
    });

    req.body.imageCover = req.files.imageCover[0].filename;
    console.log("Updated req.body.imageCover:", req.body.imageCover);
  } else {
    console.log("No new imageCover file detected");
  }

  if (req.files && req.files.images) {
    product.images.forEach((image) => {
      const oldImageFilename = image.split("/").pop();
      const oldImagePath = path.resolve(
        "uploads",
        "products",
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
    });

    req.body.images = req.files.images.map((file) => file.filename);
    console.log("Updated req.body.images:", req.body.images);
  }

  console.log("Updating product with data:", req.body);

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  console.log("Updated Product:", updatedProduct);

  if (!updatedProduct) {
    return next(new AppError("Failed to update product", 500));
  }

  res.json({ message: "success", product: updatedProduct });
});

const deleteProduct = deleteOne(Product);

export { addProduct, allProducts, getProduct, updateProduct, deleteProduct };
