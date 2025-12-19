import * as React from "react";
import { Search, Plus } from "lucide-react";
import { ChatItem } from "@/components/ui/chat-item";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat.store";
import { useAuthStore } from "@/stores/auth.store";
import { useLoadConversations } from "@/features/chat/hooks/useChat";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "unread" | "groups";

export const ConversationSidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<FilterTab>("all");

  // Load conversations từ API khi component mount
  useLoadConversations();

  const currentUser = useAuthStore((state) => state.user);
  const { conversations, activeConversationId, setActiveConversation } =
    useChatStore();

  const filteredConversations = React.useMemo(() => {
    // Filter out conversations without participants
    let filtered = conversations.filter(
      (conv) => conv.participants && conv.participants.length > 0
    );

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((conv) => {
        return conv.participants.some((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Filter by tab
    if (activeFilter === "unread") {
      filtered = filtered.filter((conv) => (conv.unreadCount || 0) > 0);
    } else if (activeFilter === "groups") {
      // For MVP, we don't have groups yet
      filtered = [];
    }

    // Sort by most recent
    return filtered.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return dateB - dateA;
    });
  }, [conversations, searchQuery, activeFilter]);

  return (
    <div className="w-full md:w-100 h-full flex flex-col bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark">
      {/* Header */}
      <div className="p-6 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-text-dark dark:text-text-white">
            Messages
          </h2>
          <Button size="icon" variant="primary">
            <Plus className="size-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text-secondary-light dark:text-text-secondary-dark" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-full bg-gray-50 dark:bg-background-darker border border-border-light dark:border-border-dark-hover text-text-dark dark:text-text-white placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-border-light dark:border-border-dark">
        <button
          onClick={() => setActiveFilter("all")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            activeFilter === "all"
              ? "bg-primary text-background-dark"
              : "bg-gray-100 dark:bg-background-darker text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-background-darkest"
          )}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter("unread")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            activeFilter === "unread"
              ? "bg-primary text-background-dark"
              : "bg-gray-100 dark:bg-background-darker text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-background-darkest"
          )}
        >
          Unread
        </button>
        <button
          onClick={() => setActiveFilter("groups")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            activeFilter === "groups"
              ? "bg-primary text-background-dark"
              : "bg-gray-100 dark:bg-background-darker text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-background-darkest"
          )}
        >
          Groups
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => {
            // check lấy thông tin user còn lại
            const participant = conversation.participants.find(
              (p) => p._id !== currentUser?.id
            );

            return (
              <ChatItem
                key={conversation._id}
                id={conversation._id}
                name={participant?.name || "Unknown"}
                avatar={participant?.avatar || undefined}
                lastMessage={
                  conversation.lastMessage?.content || "No messages yet"
                }
                timestamp={
                  conversation.updatedAt
                  // conversation.lastMessage?.timestamp || conversation.updatedAt
                }
                unreadCount={conversation.unreadCount || 0}
                online={participant?.isOnline}
                active={conversation._id === activeConversationId}
                onClick={() => setActiveConversation(conversation._id)}
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Search className="size-10 text-primary" />
            </div>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
