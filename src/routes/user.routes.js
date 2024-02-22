import Router from "express";
import {
  sentOtp,
  verifyOtp,
  activate,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/send-otp").post(sentOtp);
router.route("/verify-otp").post(verifyOtp);

router.route("/activate").post(verifyJWT, activate);
export default router;
