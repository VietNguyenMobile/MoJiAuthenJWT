import React from "react";
import useChatStore from "@/stores/useChatStore";
import GroupChatCard from "./GroupChatCard";

const GroupChatList = () => {
  const { conversations } = useChatStore();
  if (!conversations || conversations.length === 0) {
    return <div>No group conversations yet.</div>;
  }
  const groupChats = conversations.filter((convo) => convo.type === "group");
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {groupChats.map((convo) => (
        <GroupChatCard convo={convo} />
      ))}
    </div>
  );
};

export default GroupChatList;
