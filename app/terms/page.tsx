import Link from 'next/link'
import { LandingNavbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main className="px-4 pt-28 pb-20">
        <section className="mx-auto max-w-3xl space-y-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/80">
              Terms
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Tanzai terms of use
            </h1>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Tanzai provides an AI workspace for general productivity, writing,
            research, coding support, and planning. AI output can be incomplete
            or incorrect, so users are responsible for reviewing important
            decisions before relying on them.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Do not use Tanzai to violate laws, infringe rights, attack systems,
            or process sensitive data without the right safeguards. Paid plans
            are handled through Stripe when configured.
          </p>
          <Link href="/contact" className="text-primary hover:underline">
            Contact support
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
