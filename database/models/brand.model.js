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

schema.post('init', function(doc) {
  doc.logo = "http://localhost:3000/uploads/brands/" + doc.logo;
});

export const Brand = mongoose.model("Brand", schema);
