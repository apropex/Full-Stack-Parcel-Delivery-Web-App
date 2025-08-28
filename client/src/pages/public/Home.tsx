import { homePageDriver } from "@/components/layouts/driver-js/Driver";
import PageContainer from "@/components/layouts/PageContainer";
import FAQs from "@/components/modules/home-page/faqs";
import HeroSection from "@/components/modules/home-page/HeroSection";
import Services from "@/components/modules/home-page/Services";
import { useEffect, useState } from "react";

export default function Home() {
  const [isDriver, setIsDriver] = useState(false);

  useEffect(() => {
    if (!isDriver) {
      homePageDriver();
      setIsDriver(true);
    }
  }, [isDriver]);

  return (
    <PageContainer>
      <HeroSection />
      <Services />
      <FAQs />
    </PageContainer>
  );
}
