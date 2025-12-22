import { useEffect, useRef } from "react";
import { emitTyping, emitStoppedTyping } from "@/lib/socket";

export function useTypingIndicator(conversationId: string | null) {
  const typingTimeoutRef = useRef<number | null>(null);

  const handleTyping = () => {
    if (!conversationId) return;

    // Emit typing event
    emitTyping(conversationId);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout để emit stopped typing sau 3 giây không typing
    typingTimeoutRef.current = setTimeout(() => {
      emitStoppedTyping(conversationId);
    }, 3000);
  };

  const handleStopTyping = () => {
    if (!conversationId) return;

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    // Emit stopped typing immediately
    emitStoppedTyping(conversationId);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (conversationId) {
        emitStoppedTyping(conversationId);
      }
    };
  }, [conversationId]);

  return { handleTyping, handleStopTyping };
}
