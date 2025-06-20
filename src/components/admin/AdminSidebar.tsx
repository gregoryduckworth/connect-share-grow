
import { NavLink } from "react-router-dom";
import { Shield, Users, Flag, History, User, Settings, Gavel, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import UserMenu from "../layout/UserMenu";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

const navItems = [
  { icon: BarChart3, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Flag, label: "Communities", path: "/admin/communities" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Gavel, label: "Roles & Permissions", path: "/admin/roles" },
  { icon: History, label: "Audit Logs", path: "/admin/logs" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const AdminSidebar = ({ onCloseMobile }: AdminSidebarProps) => {
  const isMobile = useIsMobile();
  
  // Mock admin user data
  const adminUser = {
    name: "Admin User",
    email: "admin@example.com",
  };
  
  return (
    <div className="h-screen flex flex-col bg-white border-r">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-social-primary" />
          <div>
            <h2 className="font-bold text-social-primary">Admin Panel</h2>
            <p className="text-xs text-social-muted">Manage your platform</p>
          </div>
        </div>
        
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onCloseMobile}
            className="md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </Button>
        )}
      </div>
      
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={isMobile ? onCloseMobile : undefined}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-social-primary text-white font-medium" 
                    : "hover:bg-social-background text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <UserMenu user={adminUser} />
      </div>
    </div>
  );
};

export default AdminSidebar;
