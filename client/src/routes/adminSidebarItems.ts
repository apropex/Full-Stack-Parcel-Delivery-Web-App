import Analytics from "@/pages/admin/analytics/Analytics";
import AllUsers from "@/pages/admin/users/AllUsers";
import AllParcels from "@/pages/parcel/AllParcels";
import type { iSidebarItem } from "@/types";
import {
  BaggageClaim,
  ChartNoAxesCombined,
  LayoutDashboard,
  Package,
  UserRoundCog,
  Users,
} from "lucide-react";

export const adminSidebarItems: iSidebarItem[] = [
  {
    title: "Dashboard",
    Icon: LayoutDashboard,
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        Component: Analytics,
        Icon: ChartNoAxesCombined,
      },
    ],
  },
  {
    title: "Parcel Management",
    Icon: Package,
    items: [
      {
        title: "All Parcels",
        url: "/admin/all-parcels",
        Component: AllParcels,
        Icon: BaggageClaim,
      },
    ],
  },
  {
    title: "User Management",
    Icon: UserRoundCog,
    items: [
      {
        title: "All Users",
        url: "/admin/all-users",
        Component: AllUsers,
        Icon: Users,
      },
    ],
  },
];
