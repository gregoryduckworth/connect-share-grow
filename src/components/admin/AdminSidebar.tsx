
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Settings, 
  Shield,
  FileText,
  TrendingUp,
  Bell
} from "lucide-react";
import AdminNotificationBell from "./AdminNotificationBell";
import UserMenu from "../layout/UserMenu";

const AdminSidebar = () => {
  const location = useLocation();
  
  // Mock admin user data
  const adminUser = {
    name: "Admin User",
    email: "admin@example.com"
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: BarChart3,
      badge: null
    },
    {
      name: "Analytics", 
      href: "/admin/analytics",
      icon: TrendingUp,
      badge: null
    },
    {
      name: "Users",
      href: "/admin/users", 
      icon: Users,
      badge: null
    },
    {
      name: "Communities",
      href: "/admin/communities",
      icon: MessageSquare,
      badge: 2
    },
    {
      name: "Reports", 
      href: "/admin/reports",
      icon: Shield,
      badge: 5
    },
    {
      name: "Audit Logs",
      href: "/admin/logs",
      icon: FileText,
      badge: null
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      badge: null
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-social-primary">Admin Panel</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link key={item.name} to={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive 
                    ? "bg-social-primary text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.name}</span>
                {item.badge && (
                  <Badge className="bg-red-500 text-white text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Top Bar for Admin */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <AdminNotificationBell />
        </div>
        <UserMenu user={adminUser} />
      </div>
    </div>
  );
};

export default AdminSidebar;
