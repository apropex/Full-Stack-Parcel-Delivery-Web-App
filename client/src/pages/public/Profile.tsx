import bgImg from "@/assets/images/a7.jpg";
import PageContainer from "@/components/layouts/PageContainer";

export default function Profile() {
  return (
    <PageContainer className="p-0">
      <div className="w-full">
        <img src={bgImg} alt="" className="w-full max-h-60 object-cover" />
        <div></div>
      </div>
    </PageContainer>
  );
}
