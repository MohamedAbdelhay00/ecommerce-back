import slugify from "slugify";
import { AppError } from "../../utils/appError.js"
import { catchError } from "../../middleware/catchError.js";
import { Product } from "../../../database/models/product.model.js";
import { deleteOne } from "../handlers/handlers.js";
import fs from 'fs';
import path from 'path';

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
  // Find the product first to get the old image filenames
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Update slug if the title is changed
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  // Delete old imageCover if a new one is uploaded
  if (req.file && req.file.fieldname === 'imageCover') {
    const oldImageCoverFilename = product.imageCover.split('/').pop();
    const oldImageCoverPath = path.resolve('uploads', 'products', oldImageCoverFilename);
    console.log('Attempting to delete old image cover at:', oldImageCoverPath);

    fs.access(oldImageCoverPath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('Old image cover does not exist:', oldImageCoverPath);
      } else {
        fs.unlink(oldImageCoverPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Failed to delete old image cover:', unlinkErr);
          } else {
            console.log('Old image cover deleted successfully:', oldImageCoverPath);
          }
        });
      }
    });

    req.body.imageCover = req.file.filename;
  }

  // Delete old images if new ones are uploaded
  if (req.files && req.files.images) {
    product.images.forEach(image => {
      const oldImageFilename = image.split('/').pop();
      const oldImagePath = path.resolve('uploads', 'products', oldImageFilename);
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
    });

    req.body.images = req.files.images.map(file => file.filename);
  }

  // Update the product with the new data
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ message: "success", product: updatedProduct });
});


const deleteProduct = deleteOne(Product);

export {
  addProduct,
  allProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
