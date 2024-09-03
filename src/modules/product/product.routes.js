import { Router } from "express";
import { addProduct, allProducts, deleteProduct, getProduct, updateProduct } from "./product.controller.js";
import { uploadMultipleFiles } from "../../fileUpload/fileUpload.js";
import { validate } from "./validations.js";
import { productValidationSchema } from "./product.validation.js";

const productRouter = Router();

productRouter.route("/")
  .post(uploadMultipleFiles([{name: 'imageCover', maxCount: 1}, {name: 'images', maxCount: 8}], 'products'), 
        validate(productValidationSchema), 
        addProduct)
  .get(allProducts);

productRouter.route("/:id")
  .get(getProduct)
  .put(uploadMultipleFiles([{name: 'imageCover', maxCount: 1}, {name: 'images', maxCount: 8}], 'products'), 
       updateProduct)
  .delete(deleteProduct);

export default productRouter;
