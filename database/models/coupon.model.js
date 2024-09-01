import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discount: Number,
    expires: Date,
  },
  { timestamps: true, versionKey: false }
);

export const Coupon = mongoose.model("Coupon", schema);
