import Logout from "@/components/auth/logout";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/useAuthStore";
import { toast } from "sonner";
import instanceApi from "@/lib/axios";

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user);

  const handleOnClick = async () => {
    try {
      const response = await instanceApi.get("/users/test", {
        withCredentials: true,
      });

      console.log("Test route response:", response);
      toast.success("Test route successful!");
    } catch (error) {
      console.error("Error calling test route:", error);
      toast.error("Test route failed.");
    }
  };

  return (
    <div>
      {user && <h1>Welcome to the Chat App, {user?.username}!</h1>}
      <Logout />

      <Button onClick={handleOnClick}>test</Button>
    </div>
  );
};

export default ChatAppPage;
