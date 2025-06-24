
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";
import NotificationBell from "./NotificationBell";

const MainLayout = () => {
  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com"
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <NotificationBell />
              <UserMenu user={user} />
            </div>
          </div>

          {/* Page content - fills remaining space */}
          <div className="flex-1 min-h-0">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
