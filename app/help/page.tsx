import Link from 'next/link'
import { LandingNavbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'

const helpItems = [
  {
    title: 'Login and account access',
    body: 'Use Google sign-in or email/password on the login page. If you cannot access your account, contact support with your account email.',
  },
  {
    title: 'Chat limits',
    body: 'Free accounts are designed for light usage. Paid plan limits depend on the active Stripe configuration and available engine capacity.',
  },
  {
    title: 'Files, images, voice, and memory',
    body: 'These workflows are planned and will be introduced after the core chat, billing, and account experience are stable.',
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main className="px-4 pt-28 pb-20">
        <section className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/80">
            Help
          </p>
          <h1 className="mb-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Tanzai support
          </h1>
          <div className="space-y-4">
            {helpItems.map((item, index) => (
              <article
                id={index === 0 ? 'account' : undefined}
                key={item.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <h2 className="mb-2 text-base font-semibold text-foreground">
                  {item.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Need direct help?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contact Tanzai support
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
