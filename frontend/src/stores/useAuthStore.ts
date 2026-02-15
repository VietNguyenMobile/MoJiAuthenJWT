import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "../services/authService";
import useChatStore from "./useChatStore";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      clearState: () => {
        set({ accessToken: null, user: null, loading: false });
        localStorage.clear();
        useChatStore.getState().reset(); // Clear chat state on sign out
      },

      signUp: async (username, password, email, firstName, lastName) => {
        try {
          console.log("Signing up with:", {
            username,
            password,
            email,
            firstName,
            lastName,
          });
          set({ loading: true });

          await authService.signUp(
            username,
            password,
            email,
            firstName,
            lastName,
          );

          toast.success("Sign up successful! You can now sign in.");
        } catch (error) {
          console.error("Sign up error:", error);
          toast.error("Sign up failed. Please try again.");
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (username, password) => {
        try {
          set({ loading: true });
          localStorage.clear();
          useChatStore.getState().reset(); // Clear chat state on sign in

          const data = await authService.signIn(username, password);
          console.log("Sign in successful, received data:", data);
          set({ accessToken: data.accessToken });

          await get().fetchUserProfile();
          useChatStore.getState().fetchConversations(); // Fetch conversations after sign in

          toast.success("Sign in successful!");
        } catch (error) {
          console.error("Sign in error:", error);
          toast.error("Sign in failed. Please check your credentials.");
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          console.log("Signing out user");
          set({ loading: true });

          await authService.signOut();
          get().clearState();

          toast.success("Signed out successfully!");
        } catch (error) {
          console.error("Sign out error:", error);
          toast.error("Sign out failed. Please try again.");
        } finally {
          set({ loading: false });
        }
      },

      fetchUserProfile: async () => {
        try {
          console.log("Fetching user profile");
          set({ loading: true });

          const user = await authService.fetchUserProfile();
          console.log("Fetched user profile:", user);
          set({ user });
        } catch (error) {
          console.error("Fetch user profile error:", error);
          set({ user: null, accessToken: null });
          toast.error("Failed to fetch user profile.");
        } finally {
          set({ loading: false });
        }
      },

      refreshToken: async () => {
        try {
          console.log("Refreshing access token");
          set({ loading: true });
          const { user } = get();
          console.log("Current user before refresh:", user);

          const data = await authService.refreshToken();
          console.log("Refreshed token data:", data);
          set({ accessToken: data.accessToken });
          if (!user) {
            await get().fetchUserProfile();
          }
        } catch (error) {
          console.error("Refresh token error:", error);
          get().clearState();
          toast.error("Session expired. Please sign in again.");
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage", // name of the item in storage
      partialize: (state) => ({
        user: state.user, // persist only the user object
      }),
    },
  ),
);

export default useAuthStore;
