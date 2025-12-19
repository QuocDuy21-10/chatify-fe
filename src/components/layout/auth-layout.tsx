import * as React from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-150 h-150 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-150 h-150 rounded-full bg-primary/3 blur-[120px]" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-darker/80 backdrop-blur-md border-b border-border-light dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="size-10 rounded-xl bg-linear-to-br from-primary to-primary-hover flex items-center justify-center">
                <MessageCircle className="size-6 text-background-dark" />
              </div>
              <span className="text-xl font-bold text-text-dark dark:text-text-white">
                ChatApp
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-dark dark:hover:text-text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#safety"
                className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-dark dark:hover:text-text-white transition-colors"
              >
                Safety
              </a>
              <a
                href="#support"
                className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-dark dark:hover:text-text-white transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        {children}
      </main>
    </div>
  );
};
