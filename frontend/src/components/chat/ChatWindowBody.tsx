import useAuthStore from "@/stores/useAuthStore";
import useChatStore from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import MessageItem from "./MessageItem";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
  } = useChatStore();

  // console.log("messages in ChatWindowBody:", allMessages);

  const messages = allMessages[activeConversationId!]?.items ?? [];

  const selectedConvo =
    conversations.find((convo) => convo._id === activeConversationId) ?? null;

  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }

  if (!messages?.length) {
    return (
      <div>
        <p className="text-center flex justify-center h-full text-muted-foreground mt-10">
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
      <div className="flex flex-col overflow-y-auto overflow-x-hidden beautiful-scrollbar">
        {messages.map((message, index) => (
          <MessageItem
            key={message._id ?? index}
            messages={messages}
            index={index}
            message={message}
            selectedConvo={selectedConvo}
            lastMessageStatus="delivered"
          />
        ))}
      </div>
    </div>
  );
};

export default ChatWindowBody;
