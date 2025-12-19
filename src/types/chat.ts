export interface MessageSender {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
  isOnline: boolean;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: MessageSender;
  content: string;
  type: "text" | "image";
  imageUrl?: string;
  isRead: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Participant {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
  isOnline: boolean;
  lastSeen?: Date | string;
}

export interface Conversation {
  _id: string;
  participants: Participant[];
  lastMessage?: Message | null;
  unreadCount?: number;
  isDeleted: boolean;
  deletedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversationId: string | null;
  isTyping: Record<string, boolean>;
  isLoading: boolean;

  // Actions
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  setActiveConversation: (conversationId: string | null) => void;
  sendMessage: (
    conversationId: string,
    content: string,
    type?: "text" | "image",
    imageUrl?: string
  ) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  setTyping: (userId: string, isTyping: boolean) => void;
  addMessage: (message: Message) => void;
  updateConversation: (conversation: Conversation) => void;
  createConversation: (receiverId: string) => Promise<Conversation>;
}
