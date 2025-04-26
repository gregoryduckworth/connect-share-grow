
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  // Auto-close sidebar on mobile when component mounts
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen flex w-full bg-social-background">
      <div 
        className={`${sidebarOpen ? "fixed inset-0 z-40 bg-black/50 md:hidden" : "hidden"}`} 
        onClick={() => setSidebarOpen(false)}
      />
      
      <div 
        className={`${
          sidebarOpen 
            ? "fixed inset-y-0 left-0 z-50 w-64 transform translate-x-0" 
            : "fixed inset-y-0 left-0 z-50 w-64 transform -translate-x-full"
        } transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}
      >
        <Sidebar onCloseMobile={() => setSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center px-4 border-b bg-white sticky top-0 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-4" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen && isMobile ? <X /> : <Menu />}
          </Button>
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
