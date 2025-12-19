import * as React from "react";
import { ConversationSidebar } from "@/features/conversation/components/conversation-sidebar";
import { ChatWindow } from "@/features/chat/components/chat-window";
import { cn } from "@/lib/utils";

export const ChatPage: React.FC = () => {
  const [showSidebar, setShowSidebar] = React.useState(true);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar - Hidden on mobile when a chat is active */}
      <div
        className={cn(
          "transition-transform duration-300 md:translate-x-0",
          showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <ConversationSidebar />
      </div>

      {/* Chat Window */}
      <ChatWindow onToggleSidebar={() => setShowSidebar(!showSidebar)} />
    </div>
  );
};
