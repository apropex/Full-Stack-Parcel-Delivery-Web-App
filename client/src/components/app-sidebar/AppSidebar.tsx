import useAuth from "@/hooks/useAuth";
import type { tRole } from "@/types";
import { getSidebarItems } from "@/utils/getSidebarItems";
import { ChevronUp, User2 } from "lucide-react";
import type { ComponentProps } from "react";
import { Link, Navigate, useLocation } from "react-router";
import LoadingText from "../loader/LoadingText";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import AppSidebarHeader from "./AppSidebarHeader";

export default function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingText className="min-h-screen flex items-center" />;

  if (!user) return <Navigate to="/login" state={{ dest: pathname }} />;

  const navItems = getSidebarItems(user.role as tRole);

  console.log(user);

  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarHeader />
      <SidebarSeparator />

      <SidebarContent>
        {navItems.map(({ title, icon: Icon, items }, i) => (
          <SidebarGroup key={i}>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            {Icon && (
              <SidebarGroupAction>
                <Icon />
              </SidebarGroupAction>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(({ title, url, icon: Icon }) => (
                  <SidebarMenuItem key={url}>
                    <SidebarMenuButton asChild>
                      <Link to="/#">
                        {Icon && <Icon />} {title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {`${user.name?.firstName} ${user.name?.lastName}`}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
