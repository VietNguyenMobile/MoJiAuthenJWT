import Logout from "@/components/auth/logout";
import useAuthStore from "@/stores/useAuthStore";

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      {user && <h1>Welcome to the Chat App, {user?.username}!</h1>}
      <Logout />
    </div>
  );
};

export default ChatAppPage;
