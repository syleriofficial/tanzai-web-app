'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Start exploring Tanzai with no commitment.',
    features: ['50 messages / day', 'Text & code assistance', 'Basic file upload', 'Mobile & desktop'],
    cta: 'Get started',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$18',
    period: '/month',
    description: 'Unlimited access for individuals who demand more.',
    features: ['Unlimited messages', 'Image & voice input', 'Memory & context recall', 'Priority response speed', 'Advanced file analysis', 'Early feature access'],
    cta: 'Start Pro trial',
    href: '/signup?plan=pro',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$14',
    period: '/user/month',
    description: 'Collaborative AI for fast-moving teams.',
    features: ['Everything in Pro', 'Shared workspaces', 'Admin dashboard', 'Usage analytics', 'SSO & security controls', 'Priority support'],
    cta: 'Start team trial',
    href: '/signup?plan=team',
    highlight: false,
  },
]

export function PricingPreviewSection() {
  return (
    <section id="pricing-preview" className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/80 mb-3 block">Pricing</span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance">
            Simple, honest pricing
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            No hidden fees, no usage surprises. Pay once, think forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className={`relative glass rounded-2xl border p-7 flex flex-col ${
                plan.highlight
                  ? 'border-primary/40 glow'
                  : 'border-border/50'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                  Most popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`group flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  plan.highlight
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'border border-border text-foreground hover:border-primary/40 hover:text-primary'
                }`}
              >
                {plan.cta}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          All plans include a 14-day free trial. No credit card required.{' '}
          <Link href="/pricing" className="text-primary hover:underline">
            See full pricing details →
          </Link>
        </p>
      </div>
    </section>
  )
}
