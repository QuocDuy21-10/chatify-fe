import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full text-[10px] font-bold min-w-5 h-5 px-1.5",
          variant === "primary" && "bg-primary text-background-dark shadow-sm",
          variant === "secondary" &&
            "bg-gray-100 dark:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
