import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

const createConversation = async (req, res) => {
  try {
    const { type, name, memberIds } = req.body;

    if (
      !type ||
      (type === "group" && !name) ||
      !memberIds ||
      memberIds.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Conversation type and name are required" });
    }
    const userId = req.user._id;

    let conversation;

    if (type === "direct") {
      const participantId = memberIds[0];

      // Check if a direct conversation already exists between the two users
      conversation = await Conversation.findOne({
        type: "direct",
        participants: {
          $all: [
            { $elemMatch: { userId: userId } },
            { $elemMatch: { userId: participantId } },
          ],
        },
      });
      if (conversation) {
        return res.status(200).json({
          message: "Direct conversation already exists",
          conversation,
        });
      }
      // Create a new direct conversation
      conversation = new Conversation({
        type: "direct",
        participants: [{ userId }, { userId: participantId }],
        lastMessageAt: new Date(),
        unReadCounts: new Map(),
      });
      await conversation.save();
      res
        .status(201)
        .json({ message: "Direct conversation created", conversation });
    } else if (type === "group") {
      // Create a new group conversation
      conversation = new Conversation({
        type: "group",
        name,
        participants: [{ userId }, ...memberIds.map((id) => ({ userId: id }))],
        lastMessageAt: null,
        group: {
          name,
          createdBy: userId,
        },
        lastMessageAt: new Date(),
      });
      await conversation.save();
      res
        .status(201)
        .json({ message: "Group conversation created", conversation });
    }

    if (!conversation) {
      return res.status(500).json({ message: "Failed to create conversation" });
    }

    await conversation.populate([
      {
        path: "participants.userId",
        select: "_id displayName avatarUrl",
      },
      {
        path: "seenBy",
        select: "_id displayName avatarUrl",
      },
      {
        path: "lastMessage.senderId",
        select: "_id displayName avatarUrl",
      },
    ]);

    res.status(201).json({ message: "Conversation created", conversation });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      "participants.userId": userId,
    })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .populate({
        path: "participants.userId",
        select: "_id displayName avatarUrl",
      })
      .populate({
        path: "lastMessage.senderId",
        select: "_id displayName avatarUrl",
      })
      .populate({
        path: "seenBy",
        select: "_id displayName avatarUrl",
      });

    const formattedConversations = conversations.map((convo) => {
      const participants = (convo.participants || []).map((p) => ({
        _id: p.userId?._id,
        displayName: p.userId?.displayName,
        avatarUrl: p.userId?.avatarUrl ?? null,
        joinedAt: p.joinedAt,
      }));
      return {
        ...convo.toObject(),
        unReadCounts: convo.unReadCounts || {},
        participants,
      };
    });

    res.status(200).json({ conversations: formattedConversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMessages = async (req, res) => {};

export { createConversation, getConversations, getMessages };
