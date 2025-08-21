import App from "@/App";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { createBrowserRouter } from "react-router";
import { publicRoutes } from "./publicRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: publicRoutes,
  },

  {
    path: "login",
    Component: Login,
  },

  {
    path: "register",
    Component: Register,
  },

  // {
  //   path: "verify",
  //   Component: Verify,
  // },
]);
