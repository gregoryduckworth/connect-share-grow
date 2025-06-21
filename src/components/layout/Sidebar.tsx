
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  MessageSquare, 
  Users, 
  Search, 
  Bell,
  X
} from "lucide-react";

interface SidebarProps {
  onCloseMobile: () => void;
}

const Sidebar = ({ onCloseMobile }: SidebarProps) => {
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      badge: null
    },
    {
      name: "Communities",
      href: "/communities", 
      icon: Users,
      badge: null
    },
    {
      name: "Discover",
      href: "/discover",
      icon: Search,
      badge: null
    },
    {
      name: "Messages",
      href: "/chat",
      icon: MessageSquare,
      badge: 3
    }
  ];

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-social-primary">Connect</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCloseMobile}
          className="lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
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

export default Sidebar;
