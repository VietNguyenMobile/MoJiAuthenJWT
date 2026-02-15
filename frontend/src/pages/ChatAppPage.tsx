import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatWindowLayout from "@/components/chat/ChatWindowLayout";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const ChatAppPage = () => {
  const { user, signOut } = useAuthStore();
  const { navigate } = useNavigate();

  const handleLogOut = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-screen w-full p-2">
        <ChatWindowLayout />
      </div>
      <Button onClick={handleLogOut}>Logout</Button>
    </SidebarProvider>
  );
};

export default ChatAppPage;
