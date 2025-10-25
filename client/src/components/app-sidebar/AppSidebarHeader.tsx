import Logo from "@/assets/icons/logo";
import { Link } from "react-router";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../ui/sidebar";

export default function AppSidebarHeader() {
  return (
    <SidebarHeader className="py-4">
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="relative">
            <SidebarMenuButton asChild>
              <Link to="/">
                <Logo />
                <span>HAPPY PARCEL</span>
              </Link>
            </SidebarMenuButton>

            <div className="absolute top-0 right-0 sm:hidden">
              <SidebarTrigger className="bg-muted" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
