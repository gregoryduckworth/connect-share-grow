
import { Outlet } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";
import NotificationBell from "./NotificationBell";
import BaseLayout from "./BaseLayout";

const MainLayout = () => {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com"
  };

  const header = (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1" />
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <UserMenu user={user} />
      </div>
    </header>
  );

  return (
    <BaseLayout
      sidebar={<Sidebar />}
      header={header}
    >
      <Outlet />
    </BaseLayout>
  );
};

export default MainLayout;
