import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoggedIn: false,
      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
          localStorage.setItem("userRole", user.role);
          localStorage.setItem("userId", String(user.id));
        }
        set({ user, accessToken: token, isLoggedIn: true });
      },
      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userId");
        }
        set({ user: null, accessToken: null, isLoggedIn: false });
      },
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
    }),
    {
      name: "vulshop-auth",
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
    }
  )
);
