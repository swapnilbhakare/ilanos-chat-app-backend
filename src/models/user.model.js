import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    phone: { type: String, required: true, unique: true },
    activated: { type: Boolean, required: false },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
