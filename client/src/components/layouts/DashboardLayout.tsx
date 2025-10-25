import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import AppSidebar from "../app-sidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

export default function DashboardLayout() {
  //   const cookieStore = await cookies();
  //   const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const [collapsed, setCollapsed] = useState<boolean>(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(collapsed));
  }, [collapsed]);

  return (
    <SidebarProvider open={collapsed} onOpenChange={setCollapsed}>
      <AppSidebar />
      <div className="w-full relative">
        <div className="sticky top-5 ml-2">
          <SidebarTrigger className="bg-muted" />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
