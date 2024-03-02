import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { findUser } from "../services/user.service.js";
import { User } from "../models/user.model.js";
import UserDto from "../utils/user.dto.js";

const searchUser = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    let user;
    user = await findUser({ phone });

    const userDto = new UserDto(user);

    res
      .status(200)
      .json(new ApiResponse(200, { user: userDto }, "Otp sent successfully"));
  } catch (error) {}
});

export { searchUser };
