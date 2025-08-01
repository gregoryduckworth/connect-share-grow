import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

export function SiteHeader() {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 bg-background">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">ConnectSphere</h1>
        <div className="ml-auto flex items-center gap-2">
          <NotificationBell />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
