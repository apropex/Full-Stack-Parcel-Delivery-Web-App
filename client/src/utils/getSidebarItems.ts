import { ROLES } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { userSidebarItems } from "@/routes/userSidebarItems";
import type { tRole } from "@/types";

const { ADMIN, SENDER, RECEIVER } = ROLES;

export const getSidebarItems = (role: tRole) => {
  switch (role) {
    case ADMIN:
      return adminSidebarItems;

    case SENDER || RECEIVER:
      return userSidebarItems;

    default:
      return [];
  }
};
