import HeroSection from "@/components/HeroSection";
import UploadForm from "@/components/UploadForm";
import PremiumFooter from "@/components/PremiumFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <UploadForm />
      <PremiumFooter />
    </div>
  );
};

export default Index;
