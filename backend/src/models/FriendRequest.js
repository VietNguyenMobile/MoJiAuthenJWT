import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },
  },
  { timestamps: true },
);

friendRequestSchema.index({ from: 1, to: 1 }, { unique: true }); // Ensure unique friend requests

friendRequestSchema.index({ from: 1 }); // Indexes for efficient querying
friendRequestSchema.index({ to: 1 }); // Indexes for efficient querying

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
