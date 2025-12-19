import * as React from "react";
import { Smile, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth.store";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isTyping?: boolean;
  typingUser?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isTyping,
  typingUser,
}) => {
  const [message, setMessage] = React.useState("");
  const user = useAuthStore((state) => state.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark-alt">
      {/* Typing Indicator */}
      {isTyping && typingUser && (
        <div className="px-6 py-2 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="size-1.5 bg-primary rounded-full animate-bounce-dot" />
              <span className="size-1.5 bg-primary rounded-full animate-bounce-dot" />
              <span className="size-1.5 bg-primary rounded-full animate-bounce-dot" />
            </div>
            <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
              {typingUser} is typing...
            </span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          {/* User Avatar (hidden on mobile) */}
          <div className="hidden md:block">
            <Avatar
              src={user?.avatar}
              alt={user?.name}
              size="md"
              className="mb-2"
            />
          </div>

          {/* Input Container */}
          <div className="flex-1 rounded-3xl bg-white dark:bg-surface-dark-alt2 border border-border-light dark:border-white/5 shadow-lg dark:shadow-none focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <div className="flex items-end gap-2 p-3">
              {/* Text Input */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 bg-transparent text-text-dark dark:text-text-white placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark outline-none resize-none max-h-32 overflow-y-auto"
                style={{
                  minHeight: "24px",
                  height: "auto",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-dark dark:hover:text-text-white transition-colors"
                >
                  <Paperclip className="size-5" />
                </button>
                <button
                  type="button"
                  className="p-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-dark dark:hover:text-text-white transition-colors"
                >
                  <Smile className="size-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            size="icon"
            variant="primary"
            disabled={!message.trim()}
            className="mb-2"
          >
            <Send className="size-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};
