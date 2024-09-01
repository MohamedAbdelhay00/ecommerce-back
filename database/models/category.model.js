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
    image: String,
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

schema.post('init', function(doc) {
  doc.image = "http://localhost:3000/uploads/categories/" + doc.image;
});

export const Category = mongoose.model("Category", schema);
