import Link from 'next/link'
import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { TanzaiLogo } from '@/components/tanzai-logo'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
          <Link
            href="/chat"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Back to chat"
          >
            <ArrowLeft size={18} />
          </Link>
          <TanzaiLogo size={22} textSize="text-base" />
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/25 bg-accent">
          <ShieldAlert size={22} className="text-primary" />
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/80">
          Admin access
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Admin dashboard is not enabled yet
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Tanzai will expose admin analytics only after role-based access,
          server-side authorization, and real production metrics are connected.
          Until then, this route stays intentionally limited.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/chat"
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Back to chat
          </Link>
          <Link
            href="/security"
            className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            Security details
          </Link>
        </div>
      </main>
    </div>
  )
}
