import express from "express";
import {
  sendDirectMessage,
  sendGroupMessage,
} from "../controllers/messageController.js";
import { verifyFriendship } from "../middlewares/friendMiddleware.js";

const router = express.Router();

router.post("/direct", verifyFriendship, sendDirectMessage);

router.post("/group", sendGroupMessage);

export default router;
