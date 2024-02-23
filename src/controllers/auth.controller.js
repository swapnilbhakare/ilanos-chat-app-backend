import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { findUser, createUser } from "../services/user.service.js";
import {
  findRefreshToken,
  generateTokens,
  removeToken,
  storeRefreshToken,
  updateRefreshToken,
  verifyRefreshToken,
} from "../services/token.service.js";
import UserDto from "../utils/user.dto.js";
import path from "path";
import { fileURLToPath } from "url";
import Jimp from "jimp";
import {
  generateOtp,
  sendBySms,
  validateOtp,
} from "../services/otp.service.js";
import { hashOtp } from "../services/hash.service.js";

const sentOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    throw new ApiError(400, "Phone/Email is required");
  }
  // generating otp
  const otp = await generateOtp();
  // expiry of otp
  const timeToLeave = 1000 * 60 * 40;
  const expires = Date.now() * timeToLeave;
  const data = `${phone}.${otp}.${expires}`;
  //   hashing otp
  const hash = await hashOtp(data);

  // sending otp
  try {
    // await sendBySms(phone, otp);
    res
      .status(201)
      .json(
        new ApiResponse(
          200,
          { hash: `${hash}.${expires}`, phone, otp, auth: true },
          "Otp sent successfully"
        )
      );
  } catch (error) {
    res.status(501).json(new ApiError(500, error, "message sending failed"));
  }
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { otp, hash, phone } = req.body;

  if (!otp || !hash || !phone) {
    throw new ApiError(400, "All fields are required!");
  }

  const [hashedOtp, expires] = hash.split(".");
  if (Date.now() > +expires) {
    res.status(400).json(new ApiError(400, "OTP expired!"));
    return;
  }
  const data = `${phone}.${otp}.${expires}`;
  const isValid = await validateOtp(hashedOtp, data);
  if (!isValid) {
    res.status(400).json(new ApiError(400, "Invalid OTP !"));
    return;
  }

  try {
    let user;
    user = await findUser({ phone });
    if (!user) {
      user = await createUser({ phone, activated: false });
    }

    const { accessToken, refreshToken } = generateTokens({
      _id: user._id,
      activated: false,
    });

    await storeRefreshToken(refreshToken, user._id);

    res.cookie("refreshToken", refreshToken, {
      maxAge: 100 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 100 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    const userDto = new UserDto(user);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: userDto, auth: true },
          "Otp sent successfully"
        )
      );
  } catch (error) {
    res.status(500).json(new ApiError(500, error, "Database  error !"));
  }
});

const activate = asyncHandler(async (req, res) => {
  const { fullName, avatar } = req.body;
  if (!fullName || !avatar) {
    return res.status(400).json(new ApiError(400, "All fields are required!"));
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const base64Data = avatar.replace(/^data:image\/(jpeg|jpg|png);base64,/, "");
  const decodedImage = Buffer.from(base64Data, "base64");
  const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
  const filePath = path.resolve(__dirname, `../../public/temp/${imagePath}`);

  try {
    const jimpResponse = await Jimp.read(decodedImage);
    jimpResponse.resize(150, Jimp.AUTO).write(filePath);
    const cloudinaryResponse = await uploadOnCloudinary(filePath);

    const cloudinaryUrl = cloudinaryResponse.secure_url;

    const userId = req.user._id;
    // update user
    const user = await findUser({ _id: userId });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    user.activated = true;
    user.fullName = fullName;
    user.avatar = cloudinaryUrl;
    await user.save();

    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          { user: new UserDto(user), auth: true },
          "activated successfully"
        )
      );
  } catch (error) {
    console.error("Error activating user:", error);
    return res.status(500).json(new ApiError(500, "Something went wrong"));
  }
});

const refresh = asyncHandler(async (req, res) => {
  // Get refresh token from cookie
  const { refreshToken: refreshTokenFromCookie } = req.cookies;

  // Check if token is valid
  let userData;
  try {
    userData = await verifyRefreshToken(refreshTokenFromCookie);
  } catch (error) {
    return res.status(401).json(new ApiError(401, "Invalid Token"));
  }

  try {
    const token = await findRefreshToken(userData._id, refreshTokenFromCookie);
    if (!token) {
      return res.status(401).json(new ApiError(401, "Invalid token"));
    }
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal error"));
  }
  const user = await findUser({ _id: userData._id });

  // Check if valid user
  if (!user) {
    return res.status(404).json(new ApiError(404, "No user found"));
  }

  // Generate new tokens
  const { refreshToken, accessToken } = generateTokens({ _id: userData._id });
  console.log(refreshToken, accessToken);
  // Update refresh token
  try {
    await updateRefreshToken(userData._id, refreshToken);
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal error"));
  }

  // Put tokens in cookies
  res.cookie("refreshToken", refreshToken, {
    maxAge: 100 * 60 * 60 * 24 * 30,
    httpOnly: true,
  });

  res.cookie("accessToken", accessToken, {
    maxAge: 100 * 60 * 60 * 24 * 30,
    httpOnly: true,
  });

  // Send response
  console.log(userData);
  res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: new UserDto(user), auth: true },
        "Refresh successful"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  // delete refresh token
  await removeToken(refreshToken);

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res
    .status(201)
    .json(
      new ApiResponse(200, { user: null, auth: false }, "Refresh successful")
    );
});

export { sentOtp, verifyOtp, activate, refresh, logout };
