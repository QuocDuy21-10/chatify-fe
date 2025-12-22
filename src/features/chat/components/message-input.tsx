import * as React from "react";
import { Smile, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat.store";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";

interface MessageInputProps {
  isTyping?: boolean;
  typingUser?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  isTyping,
  typingUser,
}) => {
  const [message, setMessage] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const activeConversationId = useChatStore(
    (state) => state.activeConversationId
  );
  const sendMessage = useChatStore((state) => state.sendMessage);

  // Use typing indicator hook
  const { handleTyping, handleStopTyping } =
    useTypingIndicator(activeConversationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeConversationId || isSending) return;

    setIsSending(true);
    // Stop typing indicator when sending
    handleStopTyping();

    try {
      await sendMessage(activeConversationId, message.trim());
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) {
      handleTyping();
    } else {
      handleStopTyping();
    }
  };

  return (
    <div className="border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark-alt">
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

      <div className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1 rounded-3xl bg-white dark:bg-surface-dark-alt2 border border-border-light dark:border-white/5 shadow-lg dark:shadow-none focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <div className="flex items-center gap-2 p-3 relative">
              {/* Centered placeholder overlay */}
              {!message && !isFocused && (
                <button
                  type="button"
                  onClick={() => textareaRef.current?.focus()}
                  className="absolute  inset-0 pointer-events-auto flex items-center text-text-secondary-light dark:text-text-secondary-dark px-3 text-sm text-left"
                  aria-hidden
                >
                  Type a message...
                </button>
              )}

              {/* Text Input */}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleMessageChange}
                onKeyDown={handleKeyDown}
                rows={1}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                spellCheck={false}
                className="flex-1 bg-transparent cursor-text text-text-dark dark:text-text-white outline-none resize-none max-h-32 overflow-y-auto px-3 py-2 no-underline"
                style={{
                  minHeight: "36px",
                  height: "auto",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
              />

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  className="p-2 cursor-pointer text-text-secondary-light dark:text-text-secondary-dark hover:text-text-dark dark:hover:text-text-white transition-colors"
                >
                  <Paperclip className="size-5" />
                </button>
                <button
                  type="button"
                  className="p-2 cursor-pointer text-text-secondary-light dark:text-text-secondary-dark hover:text-text-dark dark:hover:text-text-white transition-colors"
                >
                  <Smile className="size-5" />
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            size="icon"
            variant="primary"
            disabled={!message.trim() || isSending || !activeConversationId}
            className="mb-2"
          >
            <Send className="size-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};
