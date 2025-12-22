import { io, Socket } from "socket.io-client";
import { useChatStore } from "@/stores/chat.store";
import type { Message, Conversation } from "@/types/chat";

export const socket: Socket = io(
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3000",
  {
    autoConnect: false,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  }
);

export function initializeSocket() {
  const token = localStorage.getItem("access_token");
  console.log("token", token);

  if (token && !socket.connected) {
    socket.auth = { token };
    socket.connect();
    console.log("Socket initializing with token...");
  }
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
}

// CONNECTION EVENT HANDLERS

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);

  // Rejoin tất cả active conversations sau khi reconnect
  const { activeConversationId } = useChatStore.getState();
  if (activeConversationId) {
    console.log("Rejoining conversation:", activeConversationId);
    joinConversation(activeConversationId);
  }
});

socket.on("disconnect", (reason) => {
  console.warn("Socket disconnected:", reason);
  // if code server disconnect, try to reconnect
  if (reason === "io server disconnect") {
    socket.connect();
  }
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);

  // Nếu lỗi auth, có thể token hết hạn
  if (error.message.includes("auth")) {
    console.error("Authentication failed. Token might be invalid.");
  }
});

socket.on("reconnect", (attemptNumber) => {
  console.log("Socket reconnected after", attemptNumber, "attempts");
});

socket.on("reconnect_error", (error) => {
  console.error("Reconnection error:", error);
});

socket.on("reconnect_failed", () => {
  console.error("Failed to reconnect after max attempts");
});

// MESSAGE EVENT HANDLERS

socket.on("message:received", (message: Message) => {
  console.log("New message received:", message);

  // check message duplicate
  const { messages } = useChatStore.getState();
  const conversationMessages = messages[message.conversationId] || [];
  const messageExists = conversationMessages.some(
    (msg) => msg._id === message._id
  );

  if (!messageExists) {
    useChatStore.getState().addMessage(message);
  } else {
    console.log("Message already exists, skipping...");
  }
});

socket.on("message:sent", (message: Message) => {
  console.log("Message sent confirmation:", message._id); // Backend confirm message đã được gửi thành công
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

  const updatedConversations = conversations.map((conv) => {
    const updatedParticipants = conv.participants.map((p) =>
      p._id === data.userId ? { ...p, isOnline: true } : p
    );
    return { ...conv, participants: updatedParticipants };
  });

  useChatStore.setState({ conversations: updatedConversations });
});

socket.on("user:offline", (data: { userId: string; lastSeen: string }) => {
  console.log("User offline:", data.userId);
  const { conversations } = useChatStore.getState();

  const updatedConversations = conversations.map((conv) => {
    const updatedParticipants = conv.participants.map((p) =>
      p._id === data.userId
        ? { ...p, isOnline: false, lastSeen: data.lastSeen }
        : p
    );
    return { ...conv, participants: updatedParticipants };
  });

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

// SOCKET EMIT FUNCTIONS

//  Emit typing event
export function emitTyping(conversationId: string) {
  if (socket.connected) {
    socket.emit("typing", { conversationId });
  }
}

//  Emit stopped typing event
export function emitStoppedTyping(conversationId: string) {
  if (socket.connected) {
    socket.emit("stopped-typing", { conversationId });
  }
}

//  Phải gọi hàm này khi mở một conversation để nhận real-time messages
export function joinConversation(conversationId: string) {
  if (socket.connected) {
    console.log("Joining conversation room:", conversationId);
    socket.emit("join-conversation", { conversationId });
  } else {
    console.warn("Cannot join room: Socket not connected");
  }
}

//  Leave conversation room
export function leaveConversation(conversationId: string) {
  if (socket.connected) {
    console.log("Leaving conversation room:", conversationId);
    socket.emit("leave-conversation", { conversationId });
  }
}
