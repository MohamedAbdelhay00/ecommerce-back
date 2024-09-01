import mongoose, { Types } from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
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
    logo: String,
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

export const Brand = mongoose.model("Brand", schema);
