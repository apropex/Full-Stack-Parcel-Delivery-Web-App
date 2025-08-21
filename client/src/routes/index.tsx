import App from "@/App";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ROLES } from "@/constants/role";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Verify from "@/pages/auth/Verify";
import { generateRoutes } from "@/utils/generateRoutes";
import { withAuth } from "@/utils/withAuth";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { publicRoutes } from "./publicRoutes";

const adminRoutes = [
  { index: true, element: <Navigate to="/admin/analytics" /> },
  ...generateRoutes(adminSidebarItems),
];

const { ADMIN } = ROLES;

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
