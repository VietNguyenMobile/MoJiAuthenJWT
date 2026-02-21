import instanceApi from "../lib/axios";
import type { ConversationResponse, Message } from "@/types/chat";

interface FetchMessageProps {
  messages: Message[];
  cursor?: string;
}

const pageLimit = 50;

export const chatService = {
  async fetchConversations(): Promise<ConversationResponse> {
    const response = await instanceApi.get("/conversations", {
      withCredentials: true,
    });

    console.log("Fetched conversations response:", response);
    return response.data;
  },

  async fetchMessages(
    conversationId: string,
    cursor?: string,
  ): Promise<FetchMessageProps> {
    const response = await instanceApi.get(
      `/conversations/${conversationId}/messages?limit=${pageLimit}&cursor=${cursor}`,
    );

    console.log(
      `Fetched messages for conversation ${conversationId}:`,
      response,
    );
    return {
      messages: response.data.messages,
      cursor: response.data.nextCursor,
    };
  },

  async sendDirectMessage(
    recipientId: string,
    content: string = "",
    imgUrl?: string,
    conversationId: string | null = null,
  ) {
    const res = await instanceApi.post("/messages/direct", {
      recipientId,
      content,
      imgUrl,
      conversationId,
    });

    console.log("Sent direct message response:", res);
    return res.data.message;
  },

  async sendGroupMessage(
    conversationId: string,
    content: string = "",
    imgUrl?: string,
  ) {
    const res = await instanceApi.post("/messages/group", {
      conversationId,
      content,
      imgUrl,
    });

    console.log("Sent group message response:", res);
    return res.data.message;
  },
};
