
import { Outlet } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Menu } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNotificationBell from "@/components/admin/AdminNotificationBell";
import UserMenu from "./UserMenu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";

const AdminLayout = () => {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const adminUser = {
    name: "Admin User",
    email: "admin@example.com"
  };

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-background flex w-full">
          {sidebarOpen && isMobile && (
            <div 
              className="fixed inset-0 z-40 bg-black/50 md:hidden" 
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          <div 
            className={`${
              sidebarOpen || !isMobile
                ? "fixed inset-y-0 left-0 z-50 w-64 transform translate-x-0" 
                : "fixed inset-y-0 left-0 z-50 w-64 transform -translate-x-full"
            } transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}
          >
            <AdminSidebar onCloseMobile={() => setSidebarOpen(false)} />
          </div>
          
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 md:px-6 flex-shrink-0">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <h1 className="text-lg md:text-xl font-semibold text-foreground">Admin Dashboard</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <AdminNotificationBell />
                <UserMenu user={adminUser} />
              </div>
            </header>
            
            <main className="flex-1 overflow-auto p-4 md:p-6">
              <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-700 dark:text-blue-300">Demo User Credentials</AlertTitle>
                <AlertDescription className="text-sm">
                  <div className="space-y-1">
                    <p><strong>Admin:</strong> admin@example.com / password123</p>
                    <p><strong>Moderator:</strong> mod@example.com / password123</p>
                    <p><strong>Regular User:</strong> user@example.com / password123</p>
                  </div>
                </AlertDescription>
              </Alert>
              
              <div className="h-full">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AdminLayout;
