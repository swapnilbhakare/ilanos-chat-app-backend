import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";

import { setupSocket } from "./socket.js";
const app = express();
const server = createServer(app);

const io = setupSocket(server);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";

app.use("/api/users", userRouter);

// http://localhost:8000/api/users/send-otp

export default server;
