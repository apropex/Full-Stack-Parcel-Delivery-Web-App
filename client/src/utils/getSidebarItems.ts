import { ROLES } from "@/constants";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { receiverSidebarItems } from "@/routes/receiverSidebarItems";
import { senderSidebarItems } from "@/routes/senderSidebarItems";
import type { tRole } from "@/types";

const { ADMIN, SENDER, RECEIVER } = ROLES;

export const getSidebarItems = (role: tRole) => {
  switch (role) {
    case ADMIN:
      return adminSidebarItems;

    case SENDER:
      return senderSidebarItems;

    case RECEIVER:
      return receiverSidebarItems;

    default:
      return [];
  }
};
