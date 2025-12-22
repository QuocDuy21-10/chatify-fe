import * as React from "react";
import { Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
  anchorRef: React.RefObject<HTMLElement>;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  isOpen,
  onClose,
  onSettings,
  onLogout,
  anchorRef,
}) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Đóng menu khi click bên ngoài
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose, anchorRef]);

  // Đóng menu khi nhấn Escape
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        "absolute top-full left-0 mt-2 w-56 rounded-2xl",
        "bg-surface-light dark:bg-surface-dark",
        "border border-border-light dark:border-border-dark",
        "shadow-lg overflow-hidden",
        "z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      )}
      role="menu"
      aria-orientation="vertical"
    >
      <div className="py-2">
        {/* Settings */}
        <button
          onClick={() => {
            onSettings?.();
            onClose();
          }}
          className={cn(
            "w-full px-4 py-3 flex items-center gap-3",
            "text-text-dark dark:text-text-white",
            "hover:bg-gray-100 dark:hover:bg-background-darker",
            "transition-colors duration-150",
            "text-left"
          )}
          role="menuitem"
          aria-label="Settings"
        >
          <Settings className="size-5 text-text-secondary-light dark:text-text-secondary-dark" />
          <span className="text-sm font-medium">Settings</span>
        </button>

        {/* Divider */}
        <div className="my-1 h-px bg-border-light dark:bg-border-dark" />

        {/* Logout */}
        <button
          onClick={() => {
            onLogout?.();
            onClose();
          }}
          className={cn(
            "w-full px-4 py-3 flex items-center gap-3",
            "text-red-600 dark:text-red-500",
            "hover:bg-red-50 dark:hover:bg-red-950/30",
            "transition-colors duration-150",
            "text-left"
          )}
          role="menuitem"
          aria-label="Logout"
        >
          <LogOut className="size-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
