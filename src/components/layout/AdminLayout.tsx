
import { Outlet } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminLayout = () => {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  // Auto-close sidebar on mobile when component mounts
  useState(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  });

  return (
    <div className="min-h-screen bg-social-background flex">
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
        <AdminSidebar onCloseMobile={() => setSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 bg-white border-b h-16 flex items-center px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-4" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen && isMobile ? <X /> : <Menu />}
          </Button>
          <h1 className="text-xl font-semibold text-social-primary">Admin Dashboard</h1>
        </header>
        
        <main className="container mx-auto p-4 flex-1">
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-700">Demo User Credentials</AlertTitle>
            <AlertDescription className="text-sm">
              <p className="mb-1"><strong>Admin:</strong> admin@example.com / password123</p>
              <p className="mb-1"><strong>Moderator:</strong> mod@example.com / password123</p>
              <p><strong>Regular User:</strong> user@example.com / password123</p>
            </AlertDescription>
          </Alert>
          
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
