import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer", "")?.trim();

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!userData) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = userData;
    next();
  } catch (error) {
    console.log(error.message);
  }
});
