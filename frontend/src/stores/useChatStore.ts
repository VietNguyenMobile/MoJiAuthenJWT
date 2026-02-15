import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatState } from "@/types/store";
import { chatService } from "../services/chatService";

const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      convoLoading: false,
      messageLoading: false,
      loading: false,
      reset: () =>
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          loading: false,
        }),

      setActiveConversation: (id) => set({ activeConversationId: id }),

      fetchConversations: async () => {
        try {
          set({ loading: true });
          const { conversations } = await chatService.fetchConversations();
          set({ conversations, loading: false });
        } catch (error) {
          console.error("Failed to fetch conversations:", error);
          set({ loading: false });
          //   toast.error("Failed to load conversations. Please try again.");
        }
      },
    }),
    {
      name: "chat-storage", // name of the item in storage
      partialize: (state) => ({
        conversations: state.conversations, // persist only the conversations array
      }),
    },
  ),
);

export default useChatStore;
