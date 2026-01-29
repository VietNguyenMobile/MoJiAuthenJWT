import jwt from "jsonwebtoken";
import User from "../models/User.js";

// authorization middleware to protect routes
const protectedRoute = async (req, res, next) => {
  try {
    // get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // authenticate the token is valid
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(401).json({ message: "Unauthorized" });
      }

      // find the user by id in token payload
      const user = await User.findById(decoded.userId).select(
        "-hashedPassword",
      );
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = user; // attach user info to request object
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Unauthorized" });
  }
};

export { protectedRoute };
