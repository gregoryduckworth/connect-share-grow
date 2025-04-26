
import { Outlet } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const AdminLayout = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-social-background">
      <div className="bg-social-primary text-white px-4 py-2 text-center">
        <p className="text-sm font-medium">
          Admin Dashboard - Restricted Access
        </p>
      </div>
      
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
