import Link from 'next/link'
import { LandingNavbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main className="px-4 pt-28 pb-20">
        <section className="mx-auto max-w-3xl space-y-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/80">
              Security
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Security and reliability
            </h1>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Tanzai uses Supabase Auth for authentication, server-side session
            handling for protected routes, and Google Cloud Run for deployment.
            Sensitive service keys should stay on the server and should never be
            committed to GitHub.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            If you find a security issue, report it privately with steps to
            reproduce. Please do not publicly disclose vulnerabilities before
            the team has reviewed them.
          </p>
          <Link
            href="mailto:syleri.official@gmail.com?subject=Tanzai%20security%20report"
            className="text-primary hover:underline"
          >
            Report a security issue
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
