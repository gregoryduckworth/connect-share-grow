
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  // Auto-close sidebar on mobile
  const autoCloseSidebar = isMobile ? false : sidebarOpen;

  return (
    <div className="min-h-screen flex w-full bg-social-background">
      <div className={`${autoCloseSidebar ? "block" : "hidden"} md:block`}>
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center px-4 border-b bg-white">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-4" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu />
            </Button>
          )}
          <h1 className="text-xl font-semibold text-social-primary">ConnectSphere</h1>
        </header>
        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
