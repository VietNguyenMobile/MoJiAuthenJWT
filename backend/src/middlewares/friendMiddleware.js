import Friend from "../models/Friend.js";
import Conversation from "../models/Conversation.js";

const pair = (a, b) => {
  return a < b ? [a, b] : [b, a];
};

const verifyFriendship = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const { recipientId } = req.body;
    const memberIds = req.body?.memberIds ?? [];

    if (!recipientId && memberIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Recipient ID is required and memberIds" });
    }

    let userA = userId;
    let userB = recipientId;

    // Ensure consistent ordering
    const [userAOrdered, userBOrdered] = pair(userA, userB);

    const friendship = await Friend.findOne({
      userA: userAOrdered,
      userB: userBOrdered,
    });
    if (!friendship) {
      return res
        .status(403)
        .json({ message: "You can only message your friends" });
    }

    const friendChecks = memberIds.map(async (memberId) => {
      const [a, b] = pair(userId, memberId);
      const friend = await Friend.findOne({ userA: a, userB: b });
      return friend ? null : memberId;
    });

    const friendCheckResults = await Promise.all(friendChecks);
    const nonFriends = friendCheckResults.filter(Boolean);

    if (nonFriends.length > 0) {
      return res.status(403).json({
        message: `You can only add your friends to the conversation`,
        nonFriends,
      });
    }

    next();
  } catch (error) {
    console.error("Error verifying friendship:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyGroupMembership = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const { conversationId } = req.body;

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isMember = conversation.participants.some(
      (participant) => participant.userId.toString() === userId,
    );

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this conversation" });
    }

    req.conversation = conversation;

    next();
  } catch (error) {
    console.error("Error verifying group membership:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { verifyFriendship, verifyGroupMembership };
