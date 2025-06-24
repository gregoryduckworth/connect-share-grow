import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";
import NotificationBell from "./NotificationBell";
import { ThemeProvider } from "@/contexts/ThemeContext";

const MainLayout = () => {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const header = (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="flex-1" />
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <UserMenu user={user} />
      </div>
    </header>
  );

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="fixed inset-0 flex bg-background">
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0">
            {header}
            <main className="flex-1 overflow-auto">
              <div className="h-full w-full">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default MainLayout;
