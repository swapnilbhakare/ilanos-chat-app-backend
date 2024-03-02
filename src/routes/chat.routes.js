import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  sendMessage,
  getMessages,
  deleteMessage,
  editMessage,
} from "../controllers/chat.controller.js";

const router = Router();

// router.route("/send-message").post(verifyJWT, sendMessage);
// router.route("/fetch-messages/:userId").get(verifyJWT, getMessages);
// router.route("/get-messages/:senderId/:receiverId").get(verifyJWT);
// router.route("/delete-message/:messageId").delete(verifyJWT, deleteMessage);
// router.route("/edit-message/:messageId").delete(verifyJWT, editMessage);

export default router;
