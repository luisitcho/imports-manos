// models/Product.ts
import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }], // URLs (Cloudinary)
    stock: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    category: { type: String },
  },
  { timestamps: true }
);

export default models.Product || model("Product", ProductSchema);
