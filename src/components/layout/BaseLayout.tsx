import { ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarProvider } from "@/components/ui/sidebar";

interface BaseLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  header: ReactNode;
}

const BaseLayout = ({ children, sidebar, header }: BaseLayoutProps) => {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="fixed inset-0 flex bg-background">
          {sidebar}
          <div className="flex flex-col flex-1 min-w-0">
            {header}
            <main className="flex-1 overflow-auto">
              <div className="h-full w-full">{children}</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default BaseLayout;
