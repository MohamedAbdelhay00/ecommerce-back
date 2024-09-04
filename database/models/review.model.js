import mongoose, { Types } from "mongoose";

const schema = new mongoose.Schema(
  {
    comment: String,
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    rate: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    product: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

schema.pre(/^find/, function(next) {
  this.populate('user');
  next();
});

export const Review = mongoose.model("Review", schema);
