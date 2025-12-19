import api from "@/lib/axios";
import type { Message, Pagination } from "@/types/chat";

export interface MessagesResponse {
  statusCode: number;
  message: string | null;
  data: {
    data: Message[];
    pagination: Pagination;
  };
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  type?: "text" | "image";
  imageUrl?: string;
  receiverId: string;
}

export interface SendMessageResponse {
  data: Message;
}

export interface MarkAsReadRequest {
  messageIds: string[];
}

/**
 * Lấy tất cả tin nhắn trong 1 hội thoại
 * GET /api/v1/conversations/:conversationId/messages
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
  const response = await api.get<MessagesResponse>(
    `/conversations/${conversationId}/messages`
  );
  return response.data.data.data || [];
}

/**
 * Gửi tin nhắn mới
 * POST /api/v1/messages
 */
export async function sendMessage(data: SendMessageRequest): Promise<Message> {
  const response = await api.post<SendMessageResponse>("/messages", data);
  return response.data.data;
}

export interface MarkAsReadResponse {
  message: string;
}

/**
 * Đánh dấu tin nhắn đã đọc
 * POST /api/v1/messages/mark-as-read
 */
export async function markMessagesAsRead(
  data: MarkAsReadRequest
): Promise<MarkAsReadResponse> {
  const response = await api.post<MarkAsReadResponse>(
    "/messages/mark-as-read",
    data
  );
  return response.data;
}
