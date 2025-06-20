
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Users, MessageSquare, Compass, Settings } from "lucide-react";
import UserMenu from "./UserMenu";

const Sidebar = () => {
  const location = useLocation();
  
  const navigationItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Communities",
      href: "/communities",
      icon: Users,
    },
    {
      name: "Chat",
      href: "/chat",
      icon: MessageSquare,
    },
    {
      name: "Discover",
      href: "/discover",
      icon: Compass,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  // Mock user data
  const currentUser = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-social-primary flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="font-bold text-social-primary">SocialHub</span>
        </Link>
      </div>
      
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isActive ? "bg-social-accent/50 text-social-primary" : ""
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Menu at the bottom */}
      <div className="border-t p-3">
        <UserMenu user={currentUser} />
      </div>
    </div>
  );
};

export default Sidebar;
