import Friend from "../models/Friend.js";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

const sendFriendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;
    console.log("Sending friend request to:", to);
    console.log("Sending req.user:", req.user);
    const from = req.user._id;

    if (from.toString() === to) {
      return res
        .status(400)
        .json({ message: "Cannot send friend request to yourself" });
    }

    const userExists = await User.exists({ _id: to });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    let userA = from.toString();
    let userB = to.toString();

    // Ensure consistent ordering
    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    const [alreadyFriends, existingRequest] = await Promise.all([
      Friend.findOne({ userA, userB }),
      FriendRequest.exists({
        $or: [
          { from: from, to: to },
          { from: to, to: from },
        ],
      }),
    ]);

    if (alreadyFriends) {
      return res.status(400).json({ message: "You are already friends" });
    }

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request already exists between you two" });
    }

    const friendRequest = new FriendRequest({
      from,
      to,
      message,
    });
    await friendRequest.save();

    res
      .status(201)
      .json({ message: "Friend request sent successfully", friendRequest });
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    console.log("Accepting friend request with ID:", requestId);
    const userId = req.user._id;

    console.log("Authenticated user ID:", userId);

    const friendRequest = await FriendRequest.findById(requestId);
    console.log("Found friend request:", friendRequest);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to accept this request" });
    }

    console.log("Creating friendship between users:", {
      userA: friendRequest.from,
      userB: friendRequest.to,
    });

    // const userA = friendRequest.from.toString();
    // const userB = friendRequest.to.toString();

    // const newFriend = new Friend({ userA, userB });
    // await newFriend.save();

    const newFriend = await Friend.create({
      userA: friendRequest.from,
      userB: friendRequest.to,
    });

    console.log("New friendship created:", newFriend);

    await FriendRequest.findByIdAndDelete(requestId);

    const from = await User.findById(friendRequest.from).select(
      "_id displayName avatarUrl",
    );

    res.status(200).json({
      message: "Friend request accepted successfully",
      newFriend: {
        _id: newFriend?._id,
        displayName: from?.displayName,
        avatarUrl: from?.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Error accept friend:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to decline this request" });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    res.status(204).json({ message: "Friend request declined successfully" });
  } catch (error) {
    console.error("Error decline friend:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Getting friend requests for user ID:", userId);

    const populatedRequests = "_id username displayName avatarUrl";

    const [sentRequests, receivedRequests] = await Promise.all([
      FriendRequest.find({ from: userId })
        .populate("to", populatedRequests)
        .lean(),
      FriendRequest.find({ to: userId })
        .populate("from", populatedRequests)
        .lean(),
    ]);

    console.log("Found sent requests:", sentRequests);
    console.log("Found received requests:", receivedRequests);

    res.status(200).json({ sentRequests, receivedRequests });
  } catch (error) {
    console.error("Error get friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Getting friends for user ID:", userId);

    const friends = await Friend.find({
      $or: [{ userA: userId }, { userB: userId }],
    })
      .populate("userA", "_id displayName avatarUrl")
      .populate("userB", "_id displayName avatarUrl")
      .lean();

    console.log("Found friends:", friends);

    if (!friends || friends.length === 0) {
      return res.status(200).json({ friends: [] });
    }

    const friendIds = friends.map((friend) =>
      friend.userA.toString() === userId.toString()
        ? friend.userB
        : friend.userA,
    );

    res.status(200).json({ friends: friendIds });
  } catch (error) {
    console.error("Error get all friend:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests,
  getAllFriends,
};
