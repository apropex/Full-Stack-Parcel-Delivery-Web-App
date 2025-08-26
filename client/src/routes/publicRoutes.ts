import About from "@/pages/public/About";
import Contact from "@/pages/public/Contact";
import Home from "@/pages/public/Home";
import OurServices from "@/pages/public/OurServices";
import Profile from "@/pages/public/Profile";
import WhatsNew from "@/pages/public/WhatsNew";

export const publicRoutes = [
  {
    Component: Home,
    index: true,
  },
  {
    Component: OurServices,
    path: "our-services",
  },
  {
    Component: About,
    path: "about",
  },
  {
    Component: WhatsNew,
    path: "whats-new",
  },
  {
    Component: Contact,
    path: "contact",
  },
  {
    Component: Profile,
    path: "profile",
  },
];
