import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon: Icon, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="w-full">
        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">
              <Icon className="size-5" />
            </div>
          )}
          <input
            type={inputType}
            className={cn(
              "w-full h-12 px-4 rounded-xl",
              "bg-gray-50 dark:bg-input-dark",
              "border border-border-light dark:border-border-dark",
              "text-text-dark dark:text-text-white",
              "placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark",
              "focus:ring-2 focus:ring-primary/50 focus:border-primary",
              "transition-all outline-none",
              Icon && "pl-12",
              isPassword && "pr-12",
              error &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/50",
              className
            )}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-dark dark:hover:text-text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
