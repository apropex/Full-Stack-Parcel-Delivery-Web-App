import PageContainer from "@/components/layouts/PageContainer";
import FAQs from "@/components/modules/home-page/faqs";
import HeroSection from "@/components/modules/home-page/HeroSection";
import Services from "@/components/modules/home-page/Services";

export default function Home() {
  return (
    <PageContainer>
      <HeroSection />
      <Services />
      <FAQs />
    </PageContainer>
  );
}
