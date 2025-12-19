import { useEffect } from "react";
import { useChatStore } from "@/stores/chat.store";
import { socket, joinConversation, leaveConversation } from "@/lib/socket";

// Hook để load conversations khi component mount
export function useLoadConversations() {
  const loadConversations = useChatStore((state) => state.loadConversations);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);
}

// Hook để load messages khi active conversation thay đổi
export function useLoadMessages(conversationId: string | null) {
  const loadMessages = useChatStore((state) => state.loadMessages);

  useEffect(() => {
    if (conversationId) {
      loadMessages(conversationId);
      joinConversation(conversationId);

      return () => {
        leaveConversation(conversationId);
      };
    }
  }, [conversationId, loadMessages]);
}

// Hook để quản lý Socket.io lifecycle
export function useSocket() {
  useEffect(() => {
    // Nếu có token trong localStorage, tự động kết nối socket
    const token = localStorage.getItem("access_token");

    if (token && !socket.connected) {
      socket.auth = { token };
      socket.connect();
    }

    return () => {
      // Không disconnect khi unmount để giữ kết nối
      // Socket chỉ disconnect khi logout
    };
  }, []);

  return socket;
}
