import jwt from "jsonwebtoken";
import { RefreshModel } from "../models/refresh.model.js";
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

const generateTokens = (payload) => {
  if (!payload) {
    throw new Error("Payload is required for generating tokens.");
  }
  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenExpiry,
  });
  const refreshToken = jwt.sign(payload, refreshTokenSecret, {
    expiresIn: refreshTokenExpiry,
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (token, userId) => {
  try {
    await RefreshModel.create({
      token,
      userId,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export { generateTokens, storeRefreshToken };
