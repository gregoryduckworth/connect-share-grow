
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
  UserCheck,
  X
} from "lucide-react";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

const AdminSidebar = ({ onCloseMobile }: AdminSidebarProps) => {
  const location = useLocation();

  // Mock counts for sidebar badges - these should match actual data
  const getCounts = () => {
    return {
      communities: 2, // pending approvals
      reports: 5, // pending reports
      users: 847, // total users
      logs: 15 // recent audit logs
    };
  };

  const counts = getCounts();

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
      badge: counts.communities
    },
    {
      name: "Reports", 
      href: "/admin/reports",
      icon: Shield,
      badge: counts.reports
    },
    {
      name: "Roles & Permissions",
      href: "/admin/roles",
      icon: UserCheck,
      badge: null
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
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-social-primary">Admin Panel</h2>
        {onCloseMobile && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCloseMobile}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link key={item.name} to={item.href} onClick={onCloseMobile}>
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
    </div>
  );
};

export default AdminSidebar;
