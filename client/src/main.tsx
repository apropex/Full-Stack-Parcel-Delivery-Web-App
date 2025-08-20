import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner.tsx";
import "./index.css";
import { ThemeProvider } from "./provider/ThemeProvider.tsx";
import { router } from "./routes/index.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <RouterProvider router={router} />
    <Toaster richColors />
  </ThemeProvider>
);
