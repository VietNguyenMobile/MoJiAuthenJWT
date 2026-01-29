import { BrowserRouter, Routes, Route } from "react-router";
import ChatAppPage from "./pages/ChatAppPage";
import SignInPage from "./pages/SignInPage";
import SignOutPage from "./pages/SignOutPage";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />

          {/* Protected routes */}
          <Route path="/" element={<ChatAppPage />} />
          <Route path="/signout" element={<SignOutPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
