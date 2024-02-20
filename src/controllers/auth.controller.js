import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { findUser, createUser } from "../services/user.service.js";
import { generateTokens } from "../utils/generateTokens.js";
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
    await sendBySms(phone, otp);
    res
      .status(201)
      .json(
        new ApiResponse(
          200,
          { hash: `${hash}.${expires}`, phone },
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
      user = await createUser({ phone });
    }

    const { accessToken, refreshToken } = generateTokens({
      _id: user._id,
      activated: false,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 100 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res
      .status(201)
      .json(new ApiResponse(200, accessToken, "Otp sent successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, error, "Database  error !"));
  }
});

export { sentOtp, verifyOtp };
