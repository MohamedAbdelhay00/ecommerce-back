import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../utils/appError.js";

const fileUpload = (folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${folderName}`);
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + "-" + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("images only", 401), false);
    }
  };

  return multer({ storage, fileFilter });
};

export const uploadSingleFile = (fieldName, folderName) =>
  fileUpload(folderName).single(fieldName);
export const uploadMultipleFiles = (arrayOfFields, folderName) =>
  fileUpload(folderName).fields(arrayOfFields);
