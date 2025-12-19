import * as React from "react";
import { Phone, Video, Search, Info, Menu } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { MessageBubble } from "@/components/ui/message-bubble";
import { MessageInput } from "./message-input";
import { useChatStore } from "@/stores/chat.store";
import { useAuthStore } from "@/stores/auth.store";
import { formatDate } from "@/lib/utils";

interface ChatWindowProps {
  onToggleSidebar?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onToggleSidebar }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const currentUser = useAuthStore((state) => state.user);

  const {
    conversations,
    messages,
    activeConversationId,
    isTyping,
    sendMessage,
  } = useChatStore();

  const activeConversation = React.useMemo(
    () => conversations.find((c) => c._id === activeConversationId),
    [conversations, activeConversationId]
  );

  const conversationMessages = React.useMemo(() => {
    if (!activeConversationId) return [];
    const msgs = messages[activeConversationId];
    return Array.isArray(msgs) ? msgs : [];
  }, [messages, activeConversationId]);

  const groupedMessages = React.useMemo(() => {
    const groups: { date: string; messages: typeof conversationMessages }[] =
      [];

    conversationMessages.forEach((msg) => {
      const date = formatDate(msg.createdAt);
      const existingGroup = groups.find((g) => g.date === date);

      if (existingGroup) {
        existingGroup.messages.push(msg);
      } else {
        groups.push({ date, messages: [msg] });
      }
    });

    return groups;
  }, [conversationMessages]);

  const handleSendMessage = React.useCallback(
    (content: string) => {
      if (activeConversationId) {
        sendMessage(activeConversationId, content);
      }
    },
    [activeConversationId, sendMessage]
  );

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background-light dark:bg-background-darkest p-8 text-center">
        <div className="relative mb-8">
          <div className="size-32 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="text-6xl">💬</div>
          </div>
          <div className="absolute -top-4 -right-4 size-16 rounded-full bg-primary/20 blur-xl" />
          <div className="absolute -bottom-4 -left-4 size-20 rounded-full bg-primary/15 blur-xl" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-text-white mb-3">
          It's nice to chat with you
        </h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-md mb-6">
          Pick a person from the left menu and start your conversation
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-darker">
      {/* Chat Header */}
      <div className="h-20 px-4 md:px-6 flex items-center justify-between border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark-alt">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 -ml-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-dark dark:hover:text-text-white transition-colors"
          >
            <Menu className="size-6" />
          </button>

          <Avatar
            src={activeConversation.participants[0]?.avatar || undefined}
            alt={activeConversation.participants[0]?.name || "User"}
            size="md"
            online={activeConversation.participants[0]?.isOnline}
          />

          <div>
            <h3 className="font-semibold text-text-dark dark:text-text-white">
              {activeConversation.participants[0]?.name || "User"}
            </h3>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {activeConversation.participants[0]?.isOnline
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-3 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-dark dark:hover:text-text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <Phone className="size-5" />
          </button>
          <button className="p-3 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-dark dark:hover:text-text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <Video className="size-5" />
          </button>
          <button className="p-3 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-dark dark:hover:text-text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <Search className="size-5" />
          </button>
          <button className="hidden md:block p-3 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-dark dark:hover:text-text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <Info className="size-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
        {groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-6">
              <span className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                {group.date}
              </span>
            </div>

            {/* Messages */}
            {group.messages.map((message) => (
              <MessageBubble
                key={message._id}
                id={message._id}
                content={message.content}
                timestamp={message.createdAt}
                sender={{
                  id: message.sender._id,
                  name: message.sender.name,
                  avatar: message.sender.avatar || undefined,
                }}
                isSent={message.sender._id === currentUser?.id}
                type={message.type}
                imageUrl={message.imageUrl}
              />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        isTyping={isTyping[activeConversation.participants[0]?._id]}
        typingUser={activeConversation.participants[0]?.name}
      />
    </div>
  );
};
