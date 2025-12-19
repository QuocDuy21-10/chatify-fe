import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "@/types/auth";
import * as authApi from "@/features/auth/api/auth.api";
import { socket } from "@/lib/socket";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          const response = await authApi.login({ email, password });

          localStorage.setItem("access_token", response.data.access_token);
          console.log(response.data.access_token);

          const user = {
            id: response.data.user._id,
            name: response.data.user.name,
            email: response.data.user.email,
            avatar: response.data.user.avatar,
            bio: response.data.user.bio,
            online: true,
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Kết nối Socket.io sau khi đăng nhập thành công
          socket.auth = { token: response.data.access_token };
          socket.connect();
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.response?.data?.message || "Login failed");
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });

        try {
          const response = await authApi.register({ name, email, password });

          // Map _id từ backend thành id cho frontend
          const user = {
            id: response.data.user._id,
            name: response.data.user.name,
            email: response.data.user.email,
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Kết nối Socket.io sau khi đăng ký thành công
          socket.auth = { token: response.data.access_token };
          socket.connect();
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(
            error.response?.data?.message || "Registration failed"
          );
        }
      },

      logout: () => {
        localStorage.removeItem("access_token");

        // Ngắt kết nối Socket.io
        socket.disconnect();

        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
