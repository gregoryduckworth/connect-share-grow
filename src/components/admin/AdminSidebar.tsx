
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

  const getCounts = () => {
    return {
      communities: 2,
      reports: 5,
      users: 847,
      logs: 15
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
    <div className="w-64 bg-background border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
        {onCloseMobile && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCloseMobile}
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

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
                    ? "bg-primary text-primary-foreground" 
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.name}</span>
                {item.badge && (
                  <Badge className="bg-destructive text-destructive-foreground text-xs">
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
