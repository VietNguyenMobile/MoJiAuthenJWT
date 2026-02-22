import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middlewares/socketMiddleware.js";
import { getUserConversationsForSocketIO } from "../controllers/conversationController.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

const onlineUsers = new Map(); // Map to track online users and their socket IDs {userId: socketId}

io.on("connection", async (socket) => {
  const user = socket.user;
  console.log(`User ${user.displayName} online with socket ID: ${socket.id}`);

  onlineUsers.set(user._id.toString(), socket.id);

  io.emit("online-users", Array.from(onlineUsers.keys()));

  const conversationIds = await getUserConversationsForSocketIO(user._id);
  console.log("conversationIds for user:", conversationIds);

  conversationIds.forEach((convoId) => {
    socket.join(convoId);
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(user._id.toString());
    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log(`User disconnected: ${socket.id}`);
  });
});

export { io, server, app };
