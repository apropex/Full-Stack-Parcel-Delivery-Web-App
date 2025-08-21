import AppSidebar from "../AppSidebar";
import { SidebarProvider } from "../ui/sidebar";

export default function DashboardLayout() {
  //   const cookieStore = await cookies();
  //   const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
  );
}
