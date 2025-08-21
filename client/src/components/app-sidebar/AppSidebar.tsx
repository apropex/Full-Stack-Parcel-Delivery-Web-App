import useAuth from "@/hooks/useAuth";
import type { tRole } from "@/types";
import { getSidebarItems } from "@/utils/getSidebarItems";
import type { ComponentProps } from "react";
import { Link, Navigate, useLocation } from "react-router";
import LoadingText from "../loader/LoadingText";
import {
  Sidebar,
  SidebarContent,
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
    </Sidebar>
  );
}
