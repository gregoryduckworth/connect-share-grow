import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SiteHeader } from "./SiteHeader";

const MainLayout = () => {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="fixed inset-0 flex bg-background">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <SiteHeader />
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default MainLayout;
