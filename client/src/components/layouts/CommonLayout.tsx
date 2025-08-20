import type { iChildren } from "@/types";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function CommonLayout({ children }: iChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {children}
      <div className="flex-1" />
      <Footer />
    </div>
  );
}
