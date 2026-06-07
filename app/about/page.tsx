import Link from 'next/link'
import { LandingNavbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main className="px-4 pt-28 pb-20">
        <section className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/80">
            About Tanzai
          </p>
          <h1 className="mb-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            A focused AI workspace for clear thinking
          </h1>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              Tanzai is built for people who use AI to think, write, research,
              plan, and build. The product starts with a reliable chat workspace,
              then expands carefully into files,
              memory, and richer collaboration.
            </p>
            <p>
              The goal is simple: keep the interface calm, keep the answers
              useful, and make it easy to return to important work without
              losing context.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Start free
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary"
            >
              Contact Tanzai
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
