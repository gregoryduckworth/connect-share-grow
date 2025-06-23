import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, Compass, MessageCircle, Settings, Plus, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const SidebarComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sidebar className="md:w-64">
      <SidebarHeader>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <SidebarTrigger />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar className="shadow-none">
              <SidebarHeader className="md:hidden">
                <SheetHeader>
                  <SheetTitle>ConnectSphere</SheetTitle>
                  <SheetDescription>
                    Navigate your account settings.
                  </SheetDescription>
                </SheetHeader>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarMenu>
                    {[
                      { title: "Home", url: "/", icon: Home },
                      { title: "Communities", url: "/communities", icon: Users },
                      { title: "Discover", url: "/discover", icon: Compass },
                      { title: "Chat", url: "/chat", icon: MessageCircle },
                      { title: "Connections", url: "/connections", icon: Users },
                    ].map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink 
                            to={item.url}
                            className={({ isActive }) => 
                              isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                            }
                          >
                            <item.icon />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <SidebarMenuButton className="w-full justify-start">
                      <Avatar className="mr-2 h-8 w-8">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <span>John Doe</span>
                    </SidebarMenuButton>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <DropdownMenu>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <NavLink to="/profile">
                            Profile
                          </NavLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <NavLink to="/settings">
                            Settings
                          </NavLink>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <NavLink to="/logout">
                            Logout
                          </NavLink>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </PopoverContent>
                </Popover>
              </SidebarFooter>
            </Sidebar>
          </SheetContent>
        </Sheet>
        ConnectSphere
      </SidebarHeader>

      <SidebarContent className="md:block hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {[
              { title: "Home", url: "/", icon: Home },
              { title: "Communities", url: "/communities", icon: Users },
              { title: "Discover", url: "/discover", icon: Compass },
              { title: "Chat", url: "/chat", icon: MessageCircle },
              { title: "Connections", url: "/connections", icon: Users },
            ].map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to={item.url}
                    className={({ isActive }) => 
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                    }
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="md:block hidden">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <SidebarMenuButton className="w-full justify-start">
              <Avatar className="mr-2 h-8 w-8">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span>John Doe</span>
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <DropdownMenu>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <NavLink to="/profile">
                    Profile
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <NavLink to="/settings">
                    Settings
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <NavLink to="/logout">
                    Logout
                  </NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarComponent;
