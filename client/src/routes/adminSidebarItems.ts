import Analytics from "@/pages/admin/analytics/Analytics";
import AllParcels from "@/pages/admin/parcel/AllParcels";
import type { iSidebarItem } from "@/types";
import {
  BaggageClaim,
  ChartNoAxesCombined,
  LayoutDashboard,
  Package,
} from "lucide-react";

export const adminSidebarItems: iSidebarItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        Component: Analytics,
        icon: ChartNoAxesCombined,
      },
    ],
  },
  {
    title: "Parcel Management",
    icon: Package,
    items: [
      {
        title: "All Parcels",
        url: "/admin/all-parcels",
        Component: AllParcels,
        icon: BaggageClaim,
      },
    ],
  },
];
