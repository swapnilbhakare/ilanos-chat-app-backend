import { verifyAccessToken } from "../services/token.service.js";
import { ApiError } from "../utils/ApiError.js";
const verifyJWT = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      throw new Error();
    }
    const userData = await verifyAccessToken(accessToken);
    if (!userData) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = userData;
    next();
  } catch (error) {
    res
      .status(401)
      .json(new ApiError(401, error?.message || "Invalid access token"));
  }
};

export { verifyJWT };
