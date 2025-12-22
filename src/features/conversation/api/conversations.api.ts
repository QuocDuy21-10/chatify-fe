import api from "@/lib/axios";
import type { Conversation } from "@/types/chat";
import type {
  ConversationsResponse,
  CreateConversationRequest,
  CreateConversationResponse,
} from "../types/conversation";

export async function getConversations(): Promise<Conversation[]> {
  const response = await api.get<ConversationsResponse>("/conversations");
  return response.data.data || [];
}

export async function createConversation(
  data: CreateConversationRequest
): Promise<Conversation> {
  const response = await api.post<CreateConversationResponse>(
    "/conversations",
    data
  );
  return response.data.data;
}

export async function getConversationById(
  conversationId: string
): Promise<Conversation> {
  const response = await api.get<{ data: Conversation }>(
    `/conversations/${conversationId}`
  );
  return response.data.data;
}
