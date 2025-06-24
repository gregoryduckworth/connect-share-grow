
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";
import NotificationBell from "./NotificationBell";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Menu } from "lucide-react";

const MainLayout = () => {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com"
  };

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-background flex w-full">
          <Sidebar />

          <div className="flex-1 flex flex-col min-w-0">
            <div className="h-16 bg-background border-b border-border flex items-center justify-between px-4 md:px-6 flex-shrink-0">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <div className="flex-1" />
              </div>
              <div className="flex items-center gap-2">
                <NotificationBell />
                <UserMenu user={user} />
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <div className="p-4 md:p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default MainLayout;
