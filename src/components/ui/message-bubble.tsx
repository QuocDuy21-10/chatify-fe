import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { formatTime } from "@/lib/utils";

export interface MessageBubbleProps {
  id: string;
  content: string;
  timestamp: Date | string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  isSent?: boolean;
  type?: "text" | "image";
  imageUrl?: string;
}

const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  (
    { content, timestamp, sender, isSent = false, type = "text", imageUrl },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-3 mb-4",
          isSent ? "flex-row-reverse" : "flex-row"
        )}
      >
        {!isSent && <Avatar src={sender.avatar} alt={sender.name} size="sm" />}

        <div
          className={cn(
            "flex flex-col gap-1 max-w-[70%] md:max-w-[60%]",
            isSent && "items-end"
          )}
        >
          {!isSent && (
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs font-medium text-text-dark dark:text-text-white">
                {sender.name}
              </span>
              <span className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark">
                {formatTime(timestamp)}
              </span>
            </div>
          )}

          <div
            className={cn(
              "p-4 shadow-sm",
              isSent
                ? "bg-primary rounded-2xl rounded-br-none text-background-dark font-medium shadow-primary/20"
                : "bg-surface-light dark:bg-surface-dark rounded-2xl rounded-bl-none text-text-dark dark:text-gray-200 border border-gray-100 dark:border-white/5"
            )}
          >
            {type === "image" && imageUrl && (
              <img
                src={imageUrl}
                alt="Shared image"
                className="rounded-lg mb-2 max-w-full h-auto"
              />
            )}
            <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap wrap-break-word">
              {content}
            </p>
          </div>

          {isSent && (
            <span className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark px-1">
              {formatTime(timestamp)}
            </span>
          )}
        </div>
      </div>
    );
  }
);
MessageBubble.displayName = "MessageBubble";

export { MessageBubble };
