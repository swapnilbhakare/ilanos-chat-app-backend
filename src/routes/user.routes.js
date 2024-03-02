import Router from "express";
import {
  sentOtp,
  verifyOtp,
  activate,
  refresh,
  logout,
} from "../controllers/auth.controller.js";
import { searchUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/send-otp").post(sentOtp);
router.route("/verify-otp").post(verifyOtp);

router.route("/activate").post(verifyJWT, activate);
router.route("/refresh").get(refresh);
router.route("/logout").post(verifyJWT, logout);

router.route("/search-by-phone").post(verifyJWT, searchUser);

export default router;
