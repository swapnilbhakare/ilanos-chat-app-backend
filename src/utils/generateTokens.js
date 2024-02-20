import jwt from "jsonwebtoken";
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

export { generateTokens };
