
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Users, MessageCircle, Search, User, Settings, Video } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Users, label: "Communities", path: "/communities" },
  { icon: MessageCircle, label: "Chat", path: "/chat" },
  { icon: Search, label: "Discover", path: "/discover" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-social-primary">ConnectSphere</h2>
        <p className="text-sm text-social-muted">Connect. Share. Grow.</p>
      </div>
      
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-social-primary text-white font-medium" 
                    : "hover:bg-social-background text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-social-primary flex items-center justify-center text-white">
            <User size={18} />
          </div>
          <div>
            <p className="text-sm font-medium">Guest User</p>
            <p className="text-xs text-social-muted">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
