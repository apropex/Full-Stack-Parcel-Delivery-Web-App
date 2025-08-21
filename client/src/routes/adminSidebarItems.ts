import Analytics from "@/pages/admin/analytics/Analytics";
import AllParcels from "@/pages/admin/parcel/AllParcels";
import AllUsers from "@/pages/admin/users/AllUsers";
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
  {
    title: "User Management",
    icon: UserRoundCog,
    items: [
      {
        title: "All Users",
        url: "/admin/all-users",
        Component: AllUsers,
        icon: Users,
      },
    ],
  },
];
