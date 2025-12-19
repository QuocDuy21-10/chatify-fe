import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { formatTime } from "@/lib/utils";

export interface ChatItemProps {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: Date | string;
  unreadCount?: number;
  online?: boolean;
  active?: boolean;
  onClick?: () => void;
}

const ChatItem = React.forwardRef<HTMLDivElement, ChatItemProps>(
  (
    {
      name,
      avatar,
      lastMessage,
      timestamp,
      unreadCount,
      online,
      active,
      onClick,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          "flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors",
          "border-b border-gray-100 dark:border-border-dark/50",
          active
            ? "bg-primary/10 dark:bg-surface-dark border-l-4 border-l-primary"
            : "hover:bg-gray-100 dark:hover:bg-surface-dark/50 border-l-4 border-l-transparent"
        )}
      >
        <Avatar src={avatar} alt={name} size="md" online={online} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3
              className={cn(
                "font-semibold truncate",
                active
                  ? "text-text-dark dark:text-text-white"
                  : "text-text-dark dark:text-text-white"
              )}
            >
              {name}
            </h3>
            <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark shrink-0">
              {formatTime(timestamp)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark truncate">
              {lastMessage}
            </p>
            {unreadCount && unreadCount > 0 && (
              <Badge variant="primary">{unreadCount}</Badge>
            )}
          </div>
        </div>
      </div>
    );
  }
);
ChatItem.displayName = "ChatItem";

export { ChatItem };
