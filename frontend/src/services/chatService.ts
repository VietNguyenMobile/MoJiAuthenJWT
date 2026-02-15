import instanceApi from "../lib/axios";
import type { ConversationResponse, Message } from "@/types/chat";

export const chatService = {
  async fetchConversations(): Promise<ConversationResponse> {
    const response = await instanceApi.get("/conversations", {
      withCredentials: true,
    });
    return response.data;
  },
};
