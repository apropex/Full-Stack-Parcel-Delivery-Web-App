import AddParcel from "@/pages/parcel/AddParcel";
import MyAllParcels from "@/pages/sender/parcel/MyAllParcels";
import type { iSidebarItem } from "@/types";
import { LayoutDashboard, Package, Plus } from "lucide-react";

export const senderSidebarItems: iSidebarItem[] = [
  {
    title: "Dashboard",
    Icon: LayoutDashboard,
    items: [
      {
        title: "Add Parcel",
        url: "/sender/add-parcel",
        Component: AddParcel,
        Icon: Plus,
      },
      {
        title: "My Parcels",
        url: "/sender/my-parcels",
        Component: MyAllParcels,
        Icon: Package,
      },
    ],
  },
];
