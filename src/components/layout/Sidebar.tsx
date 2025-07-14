
import { NavLink } from "react-router-dom";
import { Home, Users, Compass, MessageCircle, BookOpen } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { t } from "@/lib/i18n";
import { useAuth } from "@/contexts/useAuth";

const SidebarComponent = () => {
  const { user } = useAuth();

  const mainNavItems = [
    { title: t("communities.joined"), url: "/", icon: Home },
    { title: t("communities.all"), url: "/communities", icon: Users },
    { title: t("nav.hotTopics"), url: "/hot-topics", icon: Compass },
  ];

  const chatNavItems = [
    { title: t("nav.chat"), url: "/chat", icon: MessageCircle },
    { title: t("nav.connections"), url: "/connections", icon: Users },
  ];

  const mentorshipNavItems = [
    { title: "Find Mentors", url: "/mentorship", icon: BookOpen },
    { title: "Become a Mentor", url: "/mentorship/become-mentor", icon: Users },
    { title: "My Sessions", url: "/mentorship/my-sessions", icon: MessageCircle },
  ];

  const adminNavItems = [
    { title: "Dashboard", url: "/admin", icon: Home },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Communities", url: "/admin/communities", icon: Compass },
    { title: "Reports", url: "/admin/reports", icon: MessageCircle },
    { title: "Logs", url: "/admin/logs", icon: MessageCircle },
    { title: "Settings", url: "/admin/settings", icon: Compass },
    { title: "Roles", url: "/admin/roles", icon: Users },
    { title: "Analytics", url: "/admin/analytics", icon: Compass },
  ];

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <span className="text-base font-semibold">ConnectSphere</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.home")}</SidebarGroupLabel>
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
          <SidebarGroupLabel>{t("nav.chat")}</SidebarGroupLabel>
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
        <Separator className="my-4 bg-border" />
        <SidebarGroup>
          <SidebarGroupLabel>Mentorship</SidebarGroupLabel>
          <SidebarMenu>
            {mentorshipNavItems.map((item) => (
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
        {user?.role === "admin" && (
          <>
            <Separator className="my-4 bg-border" />
            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarMenu>
                {adminNavItems.map((item) => (
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
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarComponent;
