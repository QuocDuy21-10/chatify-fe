import { create } from "zustand";
import type { ChatState, Message, Conversation } from "@/types/chat";
import * as conversationsApi from "@/features/conversation/api/conversations.api";
import * as messagesApi from "@/features/chat/api/messages.api";

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: {},
  activeConversationId: null,
  isTyping: {},
  isLoading: false,

  // Load tất cả conversations
  loadConversations: async () => {
    set({ isLoading: true });
    try {
      const conversations = await conversationsApi.getConversations();
      set({ conversations, isLoading: false });
    } catch (error) {
      console.error("Failed to load conversations:", error);
      set({ isLoading: false });
    }
  },

  // Load messages của 1 conversation
  loadMessages: async (conversationId: string) => {
    set({ isLoading: true });
    try {
      const messages = await messagesApi.getMessages(conversationId);
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: messages,
        },
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to load messages:", error);
      set({ isLoading: false });
    }
  },

  createConversation: async (receiverId: string) => {
    try {
      const conversation = await conversationsApi.createConversation({
        receiverId,
      });

      set((state) => ({
        conversations: [conversation, ...state.conversations],
      }));

      return conversation;
    } catch (error) {
      console.error("Failed to create conversation:", error);
      throw error;
    }
  },

  // Chọn conversation active
  setActiveConversation: (conversationId: string | null) => {
    set({ activeConversationId: conversationId });

    // Load messages và mark as read khi mở conversation
    if (conversationId) {
      const messages = get().messages[conversationId];
      if (!messages || messages.length === 0) {
        get().loadMessages(conversationId);
      }
      get().markAsRead(conversationId);
    }
  },

  sendMessage: async (
    conversationId: string,
    content: string,
    type: "text" | "image" = "text",
    imageUrl?: string
  ) => {
    try {
      // Get receiver ID from active conversation
      const conversation = get().conversations.find(
        (c) => c._id === conversationId
      );
      if (!conversation || !conversation.participants[0]) {
        throw new Error("Conversation or participant not found");
      }

      const receiverId = conversation.participants[0]._id;

      const message = await messagesApi.sendMessage({
        conversationId,
        content,
        type,
        imageUrl,
        receiverId,
      });

      // Thêm message vào state ( webSocket sẽ update realtime)
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: [
            ...(state.messages[conversationId] || []),
            message,
          ],
        },
        conversations: state.conversations.map((conv) =>
          conv._id === conversationId
            ? {
                ...conv,
                lastMessage: message,
                updatedAt: new Date(),
              }
            : conv
        ),
      }));
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  },

  // dánh dấu tin nhắn đã đọc
  markAsRead: async (conversationId: string) => {
    const messages = get().messages[conversationId];
    if (!messages || messages.length === 0) return;

    // Get current user from auth store or state
    const currentUserId = localStorage.getItem("user_id");

    // Lấy các message chưa đọc
    const unreadMessages = messages.filter(
      (msg) => !msg.isRead && msg.sender._id !== currentUserId
    );

    if (unreadMessages.length === 0) return;

    try {
      await messagesApi.markMessagesAsRead({
        messageIds: unreadMessages.map((msg) => msg._id),
      });

      // Update local state
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
        ),
        messages: {
          ...state.messages,
          [conversationId]: messages.map((msg) =>
            unreadMessages.some((unread) => unread._id === msg._id)
              ? { ...msg, isRead: true }
              : msg
          ),
        },
      }));
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  },

  setTyping: (userId: string, isTyping: boolean) => {
    set((state) => ({
      isTyping: {
        ...state.isTyping,
        [userId]: isTyping,
      },
    }));
  },

  // Thêm message mới từ WebSocket
  addMessage: (message: Message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [message.conversationId]: [
          ...(state.messages[message.conversationId] || []),
          message,
        ],
      },
      conversations: state.conversations.map((conv) =>
        conv._id === message.conversationId
          ? {
              ...conv,
              lastMessage: message,
              unreadCount:
                conv._id === state.activeConversationId
                  ? 0
                  : (conv.unreadCount || 0) + 1,
              updatedAt: new Date(),
            }
          : conv
      ),
    }));
  },

  // Update conversation từ WebSocket
  updateConversation: (conversation: Conversation) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv._id === conversation._id ? conversation : conv
      ),
    }));
  },
}));
