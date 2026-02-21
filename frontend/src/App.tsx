import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import ChatAppPage from "./pages/ChatAppPage";
import SignInPage from "./pages/SignInPage";
import SignOutPage from "./pages/SignOutPage";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "sonner";
import { useThemeStore } from "./stores/useThemeStore";
import useAuthStore from "./stores/useAuthStore";
import useSocketStore from "./stores/useSocketStore";

function App() {
  const { isDark, setTheme } = useThemeStore();
  const { accessToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => disconnectSocket();
  }, [accessToken]);

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ChatAppPage />} />
          </Route>

          <Route path="/signout" element={<SignOutPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
