import React from "react";
import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import useAuthStore from "@/stores/useAuthStore";
import useChatStore from "@/stores/useChatStore";
import { cn } from "@/lib/utils";

const GroupChatCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();

  console.log("GroupChatCard - convo:", convo);
  console.log("GroupChatCard - user:", user);

  if (!user) return null;
  const { activeConversationId, setActiveConversation, messages } =
    useChatStore();

  const unReadCount = convo.unReadCounts[user._id] || 0;
  const lastMessage = convo.lastMessage?.content ?? "";

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      // fetch messages for this conversation
    }
  };

  const groupName = convo.group.name ?? "";

  return (
    <ChatCard
      convoId={convo._id}
      name={groupName}
      timestamp={
        convo.lastMessage?.createdAt
          ? new Date(convo.lastMessage.createdAt)
          : undefined
      }
      isActive={activeConversationId === convo._id}
      onSelect={handleSelectConversation}
      unreadCount={unReadCount}
      leftSection={<></>}
      subtitle={
        <p className="text-sm truncate text-muted-foreground">
          {convo.participants.length} members
        </p>
      }
    />
  );
};

export default GroupChatCard;
