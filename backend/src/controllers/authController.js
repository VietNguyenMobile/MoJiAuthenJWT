import bcrypt from "bcrypt";
import User from "../models/User.js";

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

export { signUp };
