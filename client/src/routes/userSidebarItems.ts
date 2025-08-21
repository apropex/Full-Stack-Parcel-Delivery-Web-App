import AddParcel from "@/pages/admin/parcel/AddParcel";
import type { iSidebarItem } from "@/types";
import { LayoutDashboard, Plus } from "lucide-react";

export const userSidebarItems: iSidebarItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    items: [
      {
        title: "Add Parcel",
        url: "/user/add-parcel",
        Component: AddParcel,
        icon: Plus,
      },
    ],
  },
];
