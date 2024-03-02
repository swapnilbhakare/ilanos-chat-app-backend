// socket.js
import { Server } from "socket.io";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-user-room", (roomId) => {
      const room = `${roomId}`;
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on("sent-message", (data) => {
      console.log(data);
      try {
        const { room, message } = data;
        socket.to(room).emit("receive-message", data);
        console.log(`received message from ${room} ${message.message}`);
      } catch (error) {
        console.error("Error handling sent-message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export { setupSocket };
