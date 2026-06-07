'use client'

import { motion } from 'framer-motion'
import { KeyRound, Lock, Server, ShieldCheck } from 'lucide-react'

const trustPoints = [
  {
    icon: Lock,
    title: 'Private by default',
    description: 'Authentication and sessions are handled through Supabase SSR cookies.',
  },
  {
    icon: KeyRound,
    title: 'Keys stay server-side',
    description: 'Private engine and billing keys are never called directly from the browser.',
  },
  {
    icon: Server,
    title: 'Cloud Run ready',
    description: 'Tanzai runs as a production Next.js service on Google Cloud Run.',
  },
  {
    icon: ShieldCheck,
    title: 'Clear control surface',
    description: 'Protected app routes, health checks, and server-side API boundaries are in place.',
  },
]

export function TrustSection() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/80 mb-3 block">
                Trust
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                Built on clear, production-grade boundaries
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Tanzai keeps the browser, app server, auth, and engine responsibilities separate.
                That makes the product easier to secure, deploy, and improve.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {trustPoints.map((tp, i) => {
                const Icon = tp.icon
                return (
                  <motion.div
                    key={tp.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-xl border border-border bg-background/55 p-5"
                  >
                    <div className="w-9 h-9 rounded-lg bg-accent border border-primary/20 flex items-center justify-center mb-4">
                      <Icon size={17} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{tp.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tp.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
