
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
        <div className="min-h-screen bg-background flex w-full">
          {sidebar}
          <div className="flex-1 flex flex-col min-w-0">
            {header}
            <main className="flex-1 overflow-auto">
              <div className="p-4 md:p-6 h-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default BaseLayout;
