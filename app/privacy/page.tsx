import Link from 'next/link'
import { LandingNavbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main className="px-4 pt-28 pb-20">
        <section className="mx-auto max-w-3xl space-y-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/80">
              Privacy
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Tanzai privacy notice
            </h1>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Tanzai uses account, authentication, and conversation data to run
            the product and provide the AI workspace. The app is built with
            Supabase Auth and Syleri Engine. Conversations are not sold, and
            Tanzai does not use your private conversations to train Tanzai-owned
            models.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Operational logs may be used to debug errors, protect the service,
            and improve reliability. For privacy questions or deletion requests,
            contact support from the email connected to your account.
          </p>
          <Link href="/contact" className="text-primary hover:underline">
            Contact privacy support
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
