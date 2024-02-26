import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
const app = express();

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
import chatRouter from "./routes/chat.routes.js";

const server = http.createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);

// http://localhost:8000/api/users/send-otp

export default app;
