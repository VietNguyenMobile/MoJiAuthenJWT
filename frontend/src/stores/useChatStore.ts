import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatState } from "@/types/store";
import { chatService } from "../services/chatService";
import useAuthStore from "./useAuthStore";
import { toast } from "sonner";

const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      convoLoading: false,
      messageLoading: false,
      loading: false,

      setActiveConversation: (id) => set({ activeConversationId: id }),

      reset: () =>
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          convoLoading: false,
          messageLoading: false,
        }),

      fetchConversations: async () => {
        try {
          set({ convoLoading: true });
          const { conversations } = await chatService.fetchConversations();
          set({ conversations, convoLoading: false });
        } catch (error) {
          console.error("Failed to fetch conversations:", error);
          set({ convoLoading: false });
          //   toast.error("Failed to load conversations. Please try again.");
        }
      },
      fetchMessages: async (conversationId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();

        console.log("user in fetchMessages:", user);

        const convoId = conversationId ?? activeConversationId;
        if (!convoId) {
          console.warn("No active conversation ID to fetch messages for.");
          return;
        }

        const current = messages?.[convoId];
        const nextCursor =
          current?.nextCursor == undefined ? "" : current?.nextCursor;

        if (nextCursor === null) {
          console.log("No more messages to load for conversation:", convoId);
          return;
        }

        set({ messageLoading: true });
        try {
          const { messages: newMessages, cursor } =
            await chatService.fetchMessages(convoId, nextCursor);

          const processedMessages = newMessages.map((msg) => ({
            ...msg,
            isOwn: msg.senderId === user?._id,
          }));

          set((state) => {
            const prev = state.messages[convoId]?.items ?? [];
            const merged =
              prev.length > 0
                ? [...processedMessages, ...prev]
                : processedMessages;
            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: merged,
                  hasMore: !!cursor,
                  nextCursor: cursor ?? null,
                },
              },
            };
          });
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          set({ messageLoading: false });
          //   toast.error("Failed to load messages. Please try again.");
        } finally {
          set({ messageLoading: false });
        }
      },

      sendDirectMessage: async (recipientId, content, imgUrl) => {
        try {
          const { activeConversationId } = get();

          await chatService.sendDirectMessage(
            recipientId,
            content,
            imgUrl,
            activeConversationId || undefined,
          );

          set((state) => ({
            conversations: state.conversations.map((convo) =>
              convo._id === activeConversationId
                ? { ...convo, seenBy: [] }
                : convo,
            ),
          }));
        } catch (error) {
          console.error("Failed to send direct message:", error);
          // toast.error("Failed to send message. Please try again.");
        }
      },

      sendGroupMessage: async (conversationId, content, imgUrl) => {
        try {
          const { activeConversationId } = get();
          await chatService.sendGroupMessage(conversationId, content, imgUrl);
          set((state) => ({
            conversations: state.conversations.map((convo) =>
              convo._id === activeConversationId
                ? { ...convo, seenBy: [] }
                : convo,
            ),
          }));
        } catch (error) {
          console.error("Failed to send group message:", error);
          toast.error("Failed to send message. Please try again.");
        }
      },
      addMessage: async (message) => {
        try {
          const { user } = useAuthStore.getState();
          const { fetchMessages } = get();
          message.isOwn = message.senderId === user?._id;
          const convoId = message.conversationId;
          let prevItems = get().messages[convoId]?.items ?? [];

          // Avoid duplicates
          if (prevItems.length === 0) {
            await fetchMessages(convoId);
            prevItems = get().messages[convoId]?.items ?? [];
          }

          set((state) => {
            if (prevItems.some((msg) => msg._id === message._id)) {
              return state; // No update if message already exists
            }

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: [...prevItems, message],
                  hasMore: state.messages[convoId]?.hasMore,
                  nextCursor: state.messages[convoId]?.nextCursor ?? undefined,
                },
              },
            };
          });
        } catch (error) {
          console.error("Failed to add message:", error);
        }
      },
      updateConversation: (conversation) => {
        set((state) => ({
          conversations: state.conversations.map((convo) =>
            convo._id === conversation._id
              ? { ...convo, ...conversation }
              : convo,
          ),
        }));
      },
      markAsSeen: async () => {},
    }),
    {
      name: "chat-storage", // name of the item in storage
      // partialize: (state) => ({
      //   conversations: state.conversations, // persist only the conversations array
      // }),
      partialize: (state) => ({ conversations: state.conversations }),
    },
  ),
);

export default useChatStore;
