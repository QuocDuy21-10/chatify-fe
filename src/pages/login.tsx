import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth.store";
import {
  loginSchema,
  type LoginForm,
} from "@/features/auth/schemas/login.schema";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      navigate("/chat");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-120 bg-surface-light dark:bg-card-dark rounded-xl md:rounded-2xl shadow-2xl border border-border-light dark:border-border-dark p-8">
        {/* Hero Image/Illustration */}
        <div className="h-32 mb-6 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <div className="text-6xl">💬</div>
        </div>

        {/* Welcome Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Sign in to continue chatting
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="Email address"
              icon={Mail}
              error={errors.email?.message}
            />
          </div>

          <div>
            <Input
              {...register("password")}
              type="password"
              placeholder="Password"
              icon={Lock}
              error={errors.password?.message}
            />
            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-hover transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:text-primary-hover font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
