import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeState } from "@/types/store";

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,

      toggleTheme: () => {
        const newValue = !get().isDark;
        set({ isDark: newValue });
        if (newValue) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },

      setTheme: (isDark: boolean) => {
        set({ isDark });
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
    }),
    {
      name: "theme-storage", // name of the item in storage
    },
  ),
);

export { useThemeStore };
