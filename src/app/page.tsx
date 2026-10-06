import { Hero } from "@/components/home/hero";
import { QuickQuoteBar } from "@/components/home/quick-quote-bar";
import { ProcessSection } from "@/components/home/process-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { MaterialsOverview } from "@/components/home/materials-overview";
import { ApplicationsSection } from "@/components/home/applications-section";
import { FAQSection } from "@/components/home/faq-section";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <QuickQuoteBar />
      <ProcessSection />
      <FeaturedProducts />
      <MaterialsOverview />
      <ApplicationsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
