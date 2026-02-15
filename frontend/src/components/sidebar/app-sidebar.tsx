import * as React from "react";
import { Command, Sun, Moon } from "lucide-react";
import { Switch } from "../ui/switch";
import CreateNewChat from "@/components/chat/CreateNewChat";
import NewGroupChatModal from "../chat/NewGroupChatModal";
import GroupChatList from "@/components/chat/GroupChatList";
import AddFriendModal from "@/components/chat/AddFriendModal";
import DirectMessageList from "@/components/chat/DirectMessageList";
import { useThemeStore } from "@/stores/useThemeStore";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <Sidebar variant="inset" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="bg-gradient-primary"
              size="lg"
              asChild
            >
              <a href="/">
                <div className="flex w-full items-center px-2 justify-between">
                  <h1 className="text-xl font-bold text-white">
                    MoJiAuthenJWT
                  </h1>
                  <div className="flex items-center gap-2">
                    <Sun className="size-4 text-white/80" />
                    <Switch
                      checked={isDark}
                      onCheckedChange={toggleTheme}
                      className="data-[state=checked]:bg-background/80"
                    />
                    <Moon className="size-4 text-white/80" />
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* New Chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Group Chat */}
        <SidebarGroup>
          <SidebarGroupLabel>Group Chats</SidebarGroupLabel>
          <SidebarGroupAction title="Create Group" className="cursor-pointer">
            <NewGroupChatModal />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <GroupChatList />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Direct Message */}
        <SidebarGroup>
          <SidebarGroupLabel>Friends</SidebarGroupLabel>
          <SidebarGroupAction title="Add Friend" className="cursor-pointer">
            <AddFriendModal />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <DirectMessageList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}
