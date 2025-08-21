import Analytics from "@/pages/admin/analytics/Analytics";
import AllParcels from "@/pages/admin/parcel/AllParcels";
import type { iSidebarItem } from "@/types";

export const adminSidebarItems: iSidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        Component: Analytics,
      },
    ],
  },
  {
    title: "Parcel Management",
    items: [
      {
        title: "All Parcels",
        url: "/admin/all-parcels",
        Component: AllParcels,
      },
    ],
  },
];
