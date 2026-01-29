import express from "express";
import { authMe } from "../controllers/userController.js";

const router = express.Router();

// Define user-related routes here
router.get("/me", authMe);

export default router;
