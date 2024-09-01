import mongoose, { Types } from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      unqiue: [true, "Name is required"],
      trim: true,
      required: true,
      minLength: [3, "Name must be at least 3 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 30,
      maxLength: 2000,
    },
    image: String,
    images: [String],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    priceAfterDiscount: {
      type: Number,
      required: true,
      min: 0,
    },
    sold: Number,
    stock: {
      type: Number,
      min: 0,
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: Types.ObjectId,
      ref: "SubCategory",
    },
    brand: {
      type: Types.ObjectId,
      ref: "Brand",
    },
    rateAvg: {
      type: Number,
      min: 0,
      max: 5,
    },
    rateCount: Number,
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

export const Product = mongoose.model("Product", schema);
