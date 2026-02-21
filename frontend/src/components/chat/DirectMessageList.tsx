import React from "react";
import useChatStore from "@/stores/useChatStore";
import DirectMessageCard from "./DirectMessageCard";

const DirectMessageList = () => {
  const { conversations } = useChatStore();

  // console.log("All conversations:", conversations);

  if (conversations.length === 0) {
    return <div>No conversations yet.</div>;
  }

  const directConversations = conversations.filter(
    (convo) => convo.type === "direct",
  );

  // console.log("Direct conversations:", directConversations);

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {directConversations.map((convo) => (
        <DirectMessageCard key={convo._id} convo={convo} />
      ))}
    </div>
  );
};

export default DirectMessageList;
