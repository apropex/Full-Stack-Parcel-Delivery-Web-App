import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import AppSidebar from "../app-sidebar/AppSidebar";
import { Separator } from "../ui/separator";
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
      <div className="w-full">
        <div className="p-4 border-b flex items-center gap-x-1.5">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
