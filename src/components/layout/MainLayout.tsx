
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";
import NotificationBell from "./NotificationBell";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useEffect, useRef, memo, useMemo } from "react";
import { useAuth } from "@/contexts/useAuth";

const MainLayout = memo(() => {
  const { user } = useAuth();
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  // Memoize header to prevent unnecessary re-renders
  const header = useMemo(() => (
    <header className="h-16 border-b flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="flex-1" />
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        {user && <UserMenu user={user} />}
      </div>
    </header>
  ), [user]);

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="fixed inset-0 flex bg-background">
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0">
            {header}
            <main ref={mainRef} className="flex-1 overflow-auto">
              <div className="h-full w-full">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
