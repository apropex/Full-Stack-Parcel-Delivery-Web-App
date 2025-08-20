import App from "@/App";
import { createBrowserRouter } from "react-router";
import { publicRoutes } from "./publicRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: publicRoutes,
  },
]);
