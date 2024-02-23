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

const verifyAccessToken = async (token) => {
  return jwt.verify(token, accessTokenSecret);
};
const verifyRefreshToken = async (token) => {
  return jwt.verify(token, refreshTokenSecret);
};

const findRefreshToken = async (userId, refreshToken) => {
  return await RefreshModel.findOne({
    userId: userId,
    token: refreshToken,
  });
};

const updateRefreshToken = async (userId, refreshToken) => {
  try {
    console.log("Updating refresh token for user ID:", userId);
    console.log("New refresh token:", refreshToken);

    const result = await RefreshModel.updateOne(
      { userId: userId },
      { token: refreshToken }
    );

    console.log("Update result:", result);

    return result;
  } catch (error) {
    console.error("Error updating refresh token:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
};

const removeToken = async (refreshToken) => {
  return await RefreshModel.deleteOne({ token: refreshToken });
};
export {
  generateTokens,
  storeRefreshToken,
  findRefreshToken,
  updateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
  removeToken,
};
