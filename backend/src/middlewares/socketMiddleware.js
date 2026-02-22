import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    console.log("socket.handshake: ", socket.handshake);
    console.log("socket.handshake.auth:", socket.handshake.auth);
    const token = socket.handshake.auth?.token;
    console.log("Received token in socket handshake:", token);
    if (!token) {
      return next(new Error("Unauthorized - Token not provided"));
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return next(new Error("Unauthorized - Token is invalid or expired"));
    }

    const user = await User.findById(decoded.userId).select("-hashedPassword");

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;

    next();
  } catch (error) {
    console.error("Error verify JWT in socketMiddleware", error);
    next(new Error("Unauthorized"));
  }
};
