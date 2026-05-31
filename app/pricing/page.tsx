'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, X, ArrowRight, HelpCircle } from 'lucide-react'
import { LandingNavbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Explore Tanzai at no cost. No credit card needed.',
    cta: 'Get started free',
    href: '/signup',
    highlight: false,
    badge: null,
  },
  {
    name: 'Pro',
    monthlyPrice: 18,
    yearlyPrice: 14,
    description: 'Unlimited AI for individuals who take their work seriously.',
    cta: 'Start 14-day trial',
    href: '/signup?plan=pro',
    highlight: true,
    badge: 'Most popular',
  },
  {
    name: 'Team',
    monthlyPrice: 22,
    yearlyPrice: 17,
    description: 'Collaborative intelligence for high-performing teams.',
    cta: 'Start team trial',
    href: '/signup?plan=team',
    highlight: false,
    badge: null,
  },
  {
    name: 'Enterprise',
    monthlyPrice: null,
    yearlyPrice: null,
    description: 'Custom deployment with full security and compliance controls.',
    cta: 'Contact sales',
    href: '#',
    highlight: false,
    badge: 'Custom',
  },
]

const features = [
  {
    category: 'Core',
    rows: [
      { label: 'Messages per day', free: '50', pro: 'Unlimited', team: 'Unlimited', enterprise: 'Unlimited' },
      { label: 'Context window', free: '32K tokens', pro: '200K tokens', team: '200K tokens', enterprise: '1M+ tokens' },
      { label: 'Response speed', free: 'Standard', pro: 'Priority', team: 'Priority', enterprise: 'Dedicated' },
    ],
  },
  {
    category: 'Inputs',
    rows: [
      { label: 'Text & code', free: true, pro: true, team: true, enterprise: true },
      { label: 'File upload & analysis', free: '5 files/day', pro: 'Unlimited', team: 'Unlimited', enterprise: 'Unlimited' },
      { label: 'Image understanding', free: false, pro: true, team: true, enterprise: true },
      { label: 'Voice input', free: false, pro: true, team: true, enterprise: true },
    ],
  },
  {
    category: 'Intelligence',
    rows: [
      { label: 'Memory & context recall', free: false, pro: true, team: true, enterprise: true },
      { label: 'Multilingual support (90+ languages)', free: true, pro: true, team: true, enterprise: true },
      { label: 'Advanced reasoning', free: false, pro: true, team: true, enterprise: true },
    ],
  },
  {
    category: 'Team & Admin',
    rows: [
      { label: 'Shared workspaces', free: false, pro: false, team: true, enterprise: true },
      { label: 'Admin dashboard', free: false, pro: false, team: true, enterprise: true },
      { label: 'Usage analytics', free: false, pro: false, team: true, enterprise: true },
      { label: 'SSO / SAML', free: false, pro: false, team: false, enterprise: true },
      { label: 'Audit logs', free: false, pro: false, team: false, enterprise: true },
    ],
  },
  {
    category: 'Support',
    rows: [
      { label: 'Support tier', free: 'Community', pro: 'Email', team: 'Priority email', enterprise: 'Dedicated CSM' },
      { label: 'SLA guarantee', free: false, pro: false, team: false, enterprise: true },
    ],
  },
]

const faqs = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No lock-in, no cancellation fees. You keep access until the end of your billing period.',
  },
  {
    q: 'What counts as a "message"?',
    a: 'Each user turn in a conversation counts as one message. Tanzai\'s responses do not count toward your limit.',
  },
  {
    q: 'Do you train on my data?',
    a: 'No. Your conversations are never used to train Tanzai models. See our Privacy Policy for full details.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'All major credit cards, PayPal, and bank transfers for enterprise agreements.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'Yes — every new account gets a 14-day Pro trial, no credit card required.',
  },
]

type Cell = boolean | string

function CellValue({ value }: { value: Cell }) {
  if (value === true) return <Check size={16} className="text-primary mx-auto" />
  if (value === false) return <X size={14} className="text-muted-foreground/40 mx-auto" />
  return <span className="text-sm text-foreground">{value as string}</span>
}

export default function PricingPage() {
  const [yearly, setYearly] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-primary/80 mb-3 block">Pricing</span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-balance mb-4">
              Think deeper, for less
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-pretty">
              Start free. Scale as your thinking does. Cancel anytime.
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={cn('text-sm', !yearly ? 'text-foreground' : 'text-muted-foreground')}>Monthly</span>
              <button
                onClick={() => setYearly(!yearly)}
                className={cn(
                  'relative w-11 h-6 rounded-full border transition-colors',
                  yearly ? 'bg-primary border-primary' : 'bg-muted border-border'
                )}
                aria-label="Toggle billing period"
                role="switch"
                aria-checked={yearly}
              >
                <div
                  className={cn(
                    'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                    yearly ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
              <span className={cn('text-sm', yearly ? 'text-foreground' : 'text-muted-foreground')}>
                Yearly
                <span className="ml-1.5 text-xs font-medium px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                  Save 22%
                </span>
              </span>
            </div>
          </motion.div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  'relative glass rounded-2xl border flex flex-col p-6',
                  plan.highlight ? 'border-primary/40 glow' : 'border-border/50'
                )}
              >
                {plan.badge && (
                  <div
                    className={cn(
                      'absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold',
                      plan.highlight
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground border border-border'
                    )}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="font-semibold text-foreground mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    {plan.monthlyPrice === null ? (
                      <span className="text-2xl font-bold text-foreground">Custom</span>
                    ) : plan.monthlyPrice === 0 ? (
                      <span className="text-2xl font-bold text-foreground">Free</span>
                    ) : (
                      <>
                        <span className="text-2xl font-bold text-foreground">
                          ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-xs text-muted-foreground">/mo{plan.name === 'Team' ? '/user' : ''}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
                </div>

                <Link
                  href={plan.href}
                  className={cn(
                    'group flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all mt-auto',
                    plan.highlight
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'border border-border text-foreground hover:border-primary/40 hover:text-primary'
                  )}
                >
                  {plan.cta}
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Feature comparison table */}
          <div className="mb-20 overflow-x-auto">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Full feature comparison</h2>
            <table className="w-full min-w-[640px]" role="table">
              <thead>
                <tr>
                  <th className="text-left py-3 pr-4 text-sm font-medium text-muted-foreground w-1/3">Feature</th>
                  {plans.map((p) => (
                    <th key={p.name} className={cn('text-center py-3 text-sm font-semibold w-[16.6%]', p.highlight ? 'text-primary' : 'text-foreground')}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((section) => (
                  <>
                    <tr key={section.category}>
                      <td colSpan={5} className="pt-6 pb-2">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                          {section.category}
                        </span>
                      </td>
                    </tr>
                    {section.rows.map((row) => (
                      <tr key={row.label} className="border-t border-border/30 hover:bg-accent/20 transition-colors">
                        <td className="py-3 pr-4 text-sm text-muted-foreground flex items-center gap-1.5">
                          {row.label}
                        </td>
                        <td className="py-3 text-center"><CellValue value={row.free as Cell} /></td>
                        <td className="py-3 text-center"><CellValue value={row.pro as Cell} /></td>
                        <td className="py-3 text-center"><CellValue value={row.team as Cell} /></td>
                        <td className="py-3 text-center"><CellValue value={row.enterprise as Cell} /></td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Frequently asked questions</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="glass rounded-xl border border-border/50 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span className="text-sm font-medium text-foreground">{faq.q}</span>
                    <HelpCircle
                      size={15}
                      className={cn(
                        'text-muted-foreground flex-shrink-0 transition-colors',
                        openFaq === i && 'text-primary'
                      )}
                    />
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA strip */}
          <div className="mt-20 glass rounded-2xl border border-primary/20 p-10 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3 text-balance">
              Start thinking with Tanzai today
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              No credit card required. Full Pro access for 14 days.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity glow"
            >
              Create free account
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
