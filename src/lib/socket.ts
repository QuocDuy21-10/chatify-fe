import { io, Socket } from "socket.io-client";
import { useChatStore } from "@/stores/chat.store";
import type { Message, Conversation } from "@/types/chat";

export const socket: Socket = io(
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3000",
  {
    autoConnect: false, // không connect ngay khi load trang
    transports: ["websocket"],
  }
);
// WebSocket Event Handlers

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

//  Message Events

socket.on("message:received", (message: Message) => {
  console.log("New message received:", message);
  useChatStore.getState().addMessage(message);
});

socket.on("message:sent", (message: Message) => {
  console.log("Message sent:", message);
  // Update message status in store if needed
});

socket.on(
  "message:read",
  (data: { conversationId: string; messageIds: string[] }) => {
    console.log("Messages read:", data);
    const { messages } = useChatStore.getState();
    const conversationMessages = messages[data.conversationId];

    if (conversationMessages) {
      const updatedMessages = conversationMessages.map((msg) =>
        data.messageIds.includes(msg._id)
          ? { ...msg, status: "read" as const }
          : msg
      );

      useChatStore.setState((state) => ({
        messages: {
          ...state.messages,
          [data.conversationId]: updatedMessages,
        },
      }));
    }
  }
);

//  Typing Events

socket.on("user:typing", (data: { userId: string; conversationId: string }) => {
  console.log("User typing:", data);
  useChatStore.getState().setTyping(data.userId, true);

  setTimeout(() => {
    useChatStore.getState().setTyping(data.userId, false);
  }, 3000);
});

socket.on(
  "user:stopped-typing",
  (data: { userId: string; conversationId: string }) => {
    console.log("User stopped typing:", data);
    useChatStore.getState().setTyping(data.userId, false);
  }
);

//  User Status Events

socket.on("user:online", (data: { userId: string }) => {
  console.log("User online:", data.userId);
  const { conversations } = useChatStore.getState();

  const updatedConversations = conversations.map((conv) =>
    conv.participants._id === data.userId
      ? { ...conv, participants: { ...conv.participants, online: true } }
      : conv
  );

  useChatStore.setState({ conversations: updatedConversations });
});

socket.on("user:offline", (data: { userId: string; lastSeen: string }) => {
  console.log("User offline:", data.userId);
  const { conversations } = useChatStore.getState();

  const updatedConversations = conversations.map((conv) =>
    conv.participants._id === data.userId
      ? {
          ...conv,
          participants: {
            ...conv.participants,
            online: false,
            lastSeen: data.lastSeen,
          },
        }
      : conv
  );

  useChatStore.setState({ conversations: updatedConversations });
});

// Conversation Events

// New conversation created
socket.on("conversation:created", (conversation: Conversation) => {
  console.log("New conversation created:", conversation);
  const { conversations } = useChatStore.getState();

  // Check if conversation does not exist
  if (!conversations.find((conv) => conv._id === conversation._id)) {
    useChatStore.setState((state) => ({
      conversations: [conversation, ...state.conversations],
    }));
  }
});

// Emit typing event
export function emitTyping(conversationId: string) {
  socket.emit("typing", { conversationId });
}

// Emit stopped typing event
export function emitStoppedTyping(conversationId: string) {
  socket.emit("stopped-typing", { conversationId });
}

// Join conversation room
export function joinConversation(conversationId: string) {
  socket.emit("join-conversation", { conversationId });
}

// Leave conversation room
export function leaveConversation(conversationId: string) {
  socket.emit("leave-conversation", { conversationId });
}
