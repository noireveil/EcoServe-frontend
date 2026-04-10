import { Navbar } from "@/components/section/navbar";
import { HeroSection } from "@/components/section/hero-section";
import { StatsSection } from "@/components/section/stats-section";
import { HowItWorksSection } from "@/components/section/how-it-works-section";
import { FeaturesSection } from "@/components/section/features-section";
import { ImpactSection } from "@/components/section/impact-section";
import { DualCtaSection } from "@/components/section/dual-cta-section";
import { Footer } from "@/components/section/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ImpactSection />
      <DualCtaSection />
      <Footer />
    </main>
  );
}
