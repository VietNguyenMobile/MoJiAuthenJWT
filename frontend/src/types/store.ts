import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  signUp: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;

  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearState: () => void;
  fetchUserProfile: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}
