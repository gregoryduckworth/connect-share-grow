
import { Button } from "@/components/ui/button";
import { Shield, Settings } from "lucide-react";

const AdminHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-social-primary" />
        <div>
          <h1 className="text-3xl font-bold text-social-primary">Admin Dashboard</h1>
          <p className="text-social-muted">Manage communities, users and content</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="text-sm">
          <Settings className="h-4 w-4 mr-2" /> Admin Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
