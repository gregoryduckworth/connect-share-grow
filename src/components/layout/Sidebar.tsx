
import { NavLink } from "react-router-dom";
import { Home, Users, Compass, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { t } from "@/lib/i18n";
import { useTheme } from "@/contexts/ThemeContext";

const SidebarComponent = () => {
  const { language } = useTheme(); // This will trigger re-renders when language changes

  const mainNavItems = [
    { title: t('home.welcome'), url: "/", icon: Home },
    { title: t('nav.communities'), url: "/communities", icon: Users },
    { title: t('nav.discover'), url: "/discover", icon: Compass },
  ];

  const chatNavItems = [
    { title: t('nav.chat'), url: "/chat", icon: MessageCircle },
    { title: t('nav.connections'), url: "/connections", icon: Users },
  ];

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">ConnectSphere</h2>
          <SidebarTrigger className="md:hidden" />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground">{t('nav.home')}</SidebarGroupLabel>
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to={item.url}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-foreground hover:bg-accent hover:text-accent-foreground ${
                        isActive ? "bg-accent text-accent-foreground" : ""
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <Separator className="my-4 bg-border" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground">{t('nav.chat')}</SidebarGroupLabel>
          <SidebarMenu>
            {chatNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to={item.url}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-foreground hover:bg-accent hover:text-accent-foreground ${
                        isActive ? "bg-accent text-accent-foreground" : ""
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarComponent;
