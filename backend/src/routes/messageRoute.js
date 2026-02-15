import express from "express";
import {
  sendDirectMessage,
  sendGroupMessage,
} from "../controllers/messageController.js";
import {
  verifyFriendship,
  verifyGroupMembership,
} from "../middlewares/friendMiddleware.js";

const router = express.Router();

router.post("/direct", verifyFriendship, sendDirectMessage);

router.post("/group", verifyGroupMembership, sendGroupMessage);

export default router;
