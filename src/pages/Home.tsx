import { HeroSection } from '@/components/home/HeroSection';
import { StatsBar } from '@/components/home/StatsBar';
import { AboutPreview } from '@/components/home/AboutPreview';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { PricingSection } from '@/components/home/PricingSection';
import { AuthSection } from '@/components/home/AuthSection';
import { TestimonialsStrip } from '@/components/home/TestimonialsStrip';

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <AboutPreview />
      <ServicesPreview />
      <PricingSection />
      <TestimonialsStrip />
      <AuthSection />
    </>
  );
}
