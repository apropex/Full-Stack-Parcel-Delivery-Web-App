import IncomingParcels from "@/pages/receiver/parcel/IncomingParcels";
import type { iSidebarItem } from "@/types";
import { LayoutDashboard, Package } from "lucide-react";

export const receiverSidebarItems: iSidebarItem[] = [
  {
    title: "Dashboard",
    Icon: LayoutDashboard,
    items: [
      {
        title: "Incoming Parcels",
        url: "/receiver/incoming-parcels",
        Component: IncomingParcels,
        Icon: Package,
      },
    ],
  },
];
