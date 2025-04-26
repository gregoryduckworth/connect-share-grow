
import { Outlet } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
  );
};

export default AdminLayout;
