import type { Conversation } from "@/types/chat";

export interface ConversationsResponse {
  statusCode: number;
  message: string;
  data: Conversation[];
}

export interface CreateConversationRequest {
  receiverId: string;
}

export interface CreateConversationResponse {
  statusCode: number;
  message: string;
  data: Conversation;
}
