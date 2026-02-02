import express from "express";
import dotenv from "dotenv";
import connectDB from "./libs/db.js";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import friendRoutes from "./routes/friendRoute.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import messageRoutes from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser()); // Middleware to parse cookies
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allow requests from this origin
    credentials: true, // Allow cookies to be sent
  }),
);

// public routes and middleware can be added here
app.use("/api/auth", authRoutes);

// private routes and middleware can be added here
app.use(protectedRoute);
app.use("/api/users", userRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/messages", messageRoutes);

// Connect to MongoDB
connectDB()
  .then(() => {
    // Start the server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
  });

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});
