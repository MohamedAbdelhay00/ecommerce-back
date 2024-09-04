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
    imageCover: String,
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
  { timestamps: true, versionKey: false, toJSON: { virtuals: true } }
);

schema.virtual("myReviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
})

schema.pre('findOne', function() {
  this.populate('myReviews');
});

schema.post('init', function(doc) {
  if(doc.imageCover) doc.imageCover = "http://localhost:3000/uploads/products/" + doc.imageCover;
  if(doc.images) doc.images = doc.images.map(img => "http://localhost:3000/uploads/products/" + img);
});

export const Product = mongoose.model("Product", schema);
