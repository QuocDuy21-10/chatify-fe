import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  fallback?: string;
  className?: string;
}

const sizeClasses = {
  sm: "size-8",
  md: "size-12",
  lg: "size-16",
  xl: "size-24",
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, size = "md", online, fallback, className }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const initials = React.useMemo(() => {
      if (fallback) return fallback;
      if (alt) {
        return alt
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
      }
      return "?";
    }, [alt, fallback]);

    return (
      <div className={cn("relative shrink-0", className)} ref={ref}>
        <div
          className={cn(
            "rounded-full bg-primary/20 bg-cover bg-center flex items-center justify-center overflow-hidden",
            sizeClasses[size]
          )}
        >
          {src && !imageError ? (
            <img
              src={src}
              alt={alt || "Avatar"}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-primary font-bold text-sm">{initials}</span>
          )}
        </div>
        {online !== undefined && (
          <span
            className={cn(
              "absolute bottom-0 right-0 rounded-full border-2 border-surface-light dark:border-background-dark",
              size === "sm" ? "size-2" : "size-3",
              online ? "bg-primary" : "bg-gray-400"
            )}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
