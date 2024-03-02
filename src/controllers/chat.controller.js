import { asyncHandler } from "../utils/asyncHandler";
import { Chat } from "../models/chat.model.js";
const sendMessage = asyncHandler(async (req, res) => {});

const getMessages = asyncHandler(async (req, res) => {});

const deleteMessage = asyncHandler(async (req, res) => {});

const editMessage = asyncHandler(async (req, res) => {});

export { sendMessage, getMessages, deleteMessage, editMessage };
