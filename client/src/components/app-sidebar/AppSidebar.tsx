import useAuth from "@/hooks/useAuth";
import type { tRole } from "@/types";
import { getSidebarItems } from "@/utils/getSidebarItems";
import { ChevronUp, User2 } from "lucide-react";
import { type ComponentProps } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { ProfileMenu } from "../layouts/ProfileMenu";
import LoadingText from "../loader/LoadingText";
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

  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarHeader />
      <SidebarSeparator />

      <SidebarContent>
        {navItems.map(({ title, Icon, items }, i) => (
          <SidebarGroup key={i}>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            {Icon && (
              <SidebarGroupAction>
                <Icon />
              </SidebarGroupAction>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(({ title, url, Icon }) => (
                  <SidebarMenuItem key={url}>
                    <SidebarMenuButton asChild>
                      <Link to={url}>
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
            <ProfileMenu>
              <SidebarMenuButton>
                <User2 /> {`${user.name?.firstName} ${user.name?.lastName}`}
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </ProfileMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
