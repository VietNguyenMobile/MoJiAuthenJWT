import User from "../models/User.js";

const authMe = async (req, res) => {
  try {
    const user = req.user; // retrieved from authMiddleware

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { authMe };
