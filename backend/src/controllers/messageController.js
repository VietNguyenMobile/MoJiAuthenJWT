import Friend from "../models/Friend.js";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { updateConversationAfterCreateMessage } from "../utils/messageHelper.js";

const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user._id;

    console.log("senderId:", senderId);
    console.log("recipientId:", recipientId);
    console.log("conversationId:", conversationId);
    console.log("content:", content);

    let conversation;

    if (!content) {
      return res
        .status(400)
        .json({ message: "Message content cannot be empty" });
    }

    if (conversationId) {
      // If conversationId is provided, fetch that conversation
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() },
        ],
        lastMessageAt: new Date(),
        unReadCounts: new Map(),
      });

      console.log("Created new direct conversation:", conversation);
    }

    // Create and save the new message
    const message = new Message({
      conversationId: conversation._id,
      senderId,
      content,
    });
    await message.save();

    console.log("Created new message:", message);

    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.save();
    res.status(201).json({ message });
  } catch (error) {
    console.error("Error sending direct message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendGroupMessage = async (req, res) => {
  try {
    const { toGroupId, content, imgUrl } = req.body;
    const fromUserId = req.user._id;

    // Check if the group conversation exists
    const conversation = await Conversation.findOne({
      _id: toGroupId,
      isGroupChat: true,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Group conversation not found" });
    }

    // Create and save the new message
    const message = new Message({
      conversationId: conversation._id,
      senderId: fromUserId,
      content,
      imgUrl: imgUrl || "",
    });
    await message.save();

    res.status(201).json({ message, conversationId: conversation._id });
  } catch (error) {
    console.error("Error sending group message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { sendDirectMessage, sendGroupMessage };
