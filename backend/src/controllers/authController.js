import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days in seconds

const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    // console.log("Received sign up data:", req.body);

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists (this part is omitted for brevity)
    const existingUser = await User.findOne({ username });
    console.log("Existing user check:", existingUser);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or email already in use" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user object (this part is omitted for brevity)
    const newUser = new User({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });
    await newUser.save();

    console.log("New user to be saved:", newUser);

    // Save user to database (this part is omitted for brevity)

    res.status(204).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // If needed, generate JWT token here (omitted for brevity)
    const accessToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // Create refresh token and set it in HTTP-only cookie (omitted for brevity)
    const refreshToken = crypto.randomBytes(64).toString("hex");

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // Create session to save refresh token (omitted for brevity)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });

    // Return access token in response (omitted for brevity)
    res.status(200).json({
      message: `User ${user.displayName} signin success`,
      accessToken,
    });
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signOut = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    console.log("Sign out refresh token:", refreshToken);
    const token = req.cookies?.refreshToken;
    console.log("Signing out token:", token);
    if (token) {
      // xoá refresh token trong Session
      await Session.deleteOne({ refreshToken: token });

      // xoá cookie
      res.clearCookie("refreshToken");
    }

    res.status(204).json({ message: "User signed out successfully" });
  } catch (error) {
    console.error("Error during sign out:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find session by refresh token
    const session = await Session.findOne({ refreshToken });
    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find user associated with the session
    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Error during token refresh:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { signUp, signIn, signOut, refreshToken };
