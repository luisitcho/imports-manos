// models/User.ts
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true }, // bcrypt hash
    role: { type: String, enum: ["admin", "user"], default: "admin" },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
