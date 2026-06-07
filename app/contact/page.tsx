import Link from 'next/link'
import { Mail } from 'lucide-react'
import { LandingNavbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main className="px-4 pt-28 pb-20">
        <section className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/80">
            Contact
          </p>
          <h1 className="mb-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Get help with Tanzai
          </h1>
          <p className="mb-8 text-muted-foreground leading-relaxed">
            For support, billing, enterprise, partnerships, or account help,
            email the Tanzai team. Include your account email and a short
            description so the request can be handled faster.
          </p>
          <Link
            href="mailto:syleri.official@gmail.com?subject=Tanzai%20support"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Mail size={16} />
            syleri.official@gmail.com
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
