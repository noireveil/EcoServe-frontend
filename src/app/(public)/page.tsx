"use client"
import { Navbar } from "@/components/section/navbar"
import { HeroSection } from "@/components/section/hero-section"
import { StatsSection } from "@/components/section/stats-section"
import { HowItWorksSection } from "@/components/section/how-it-works-section"
import { FeaturesSection } from "@/components/section/features-section"
import { DualCtaSection } from "@/components/section/dual-cta-section"
import { ImpactSection } from "@/components/section/impact-section"
import { Footer } from "@/components/section/footer"

export default function LandingPage() {
  return (
    <div
      className="light"
      style={{
        colorScheme: "light",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        backgroundColor: "#ffffff",
        color: "#0D1117",
      }}
    >
      <Navbar />
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <DualCtaSection />
      <ImpactSection />
      <Footer />
    </div>
  )
}
