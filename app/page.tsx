import { LandingNavbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero'
import { FeaturesSection } from '@/components/landing/features'
import { UseCasesSection } from '@/components/landing/use-cases'
import { PricingPreviewSection } from '@/components/landing/pricing-preview'
import { TrustSection } from '@/components/landing/trust'
import { Footer } from '@/components/landing/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <UseCasesSection />
      <PricingPreviewSection />
      <TrustSection />
      <Footer />
    </main>
  )
}
