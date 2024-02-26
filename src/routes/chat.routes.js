import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

// router.post("/send-message", verifyJWT, sendMessage);

export default router;
