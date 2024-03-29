import mongoose, { Schema } from "mongoose";

const refreshSchema = new Schema(
  {
    token: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const RefreshModel = mongoose.model("Refresh", refreshSchema, "tokens");
