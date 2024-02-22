import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    phone: { type: String, required: true, unique: true },
    fullName: { type: String, required: false },
    avatar: { type: String, required: false },
    activated: { type: Boolean, required: false },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
