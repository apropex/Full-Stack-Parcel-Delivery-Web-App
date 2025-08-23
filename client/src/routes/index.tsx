import App from "@/App";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ROLES } from "@/constants";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Verify from "@/pages/auth/Verify";
import { generateRoutes } from "@/utils/generateRoutes";
import { withAuth } from "@/utils/withAuth";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { publicRoutes } from "./publicRoutes";
import { receiverSidebarItems } from "./receiverSidebarItems";
import { senderSidebarItems } from "./senderSidebarItems";

const adminRoutes = [
  { index: true, element: <Navigate to="/admin/analytics" /> },
  ...generateRoutes(adminSidebarItems),
];

const senderRoutes = [
  { index: true, element: <Navigate to="/sender/my-parcels" /> },
  ...generateRoutes(senderSidebarItems),
];

const receiverRoutes = [
  { index: true, element: <Navigate to="/sender/incoming-parcels" /> },
  ...generateRoutes(receiverSidebarItems),
];

const { ADMIN, SENDER, RECEIVER } = ROLES;

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: publicRoutes,
  },

  {
    path: "admin",
    Component: withAuth(DashboardLayout, ADMIN),
    children: adminRoutes,
  },

  {
    path: "sender",
    Component: withAuth(DashboardLayout, SENDER),
    children: senderRoutes,
  },

  {
    path: "receiver",
    Component: withAuth(DashboardLayout, RECEIVER),
    children: receiverRoutes,
  },

  {
    path: "login",
    Component: Login,
  },

  {
    path: "register",
    Component: Register,
  },

  {
    path: "verify",
    Component: Verify,
  },
]);
