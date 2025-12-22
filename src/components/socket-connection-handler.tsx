import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { initializeSocket } from "@/lib/socket";

export function SocketConnectionHandler() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Initializing socket connection...");
      initializeSocket();
    }
  }, [isAuthenticated]);

  return null;
}
