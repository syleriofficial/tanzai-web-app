'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Zap, Globe2 } from 'lucide-react'

const stats = [
  { value: '50K+', label: 'Active users' },
  { value: '120+', label: 'Countries' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '<200ms', label: 'Avg. response' },
]

const trustPoints = [
  {
    icon: Shield,
    title: 'Enterprise-grade security',
    description: 'SOC 2 Type II certified. Your data is encrypted in transit and at rest.',
  },
  {
    icon: Lock,
    title: 'Privacy by design',
    description: 'No training on your conversations. Full data deletion on request.',
  },
  {
    icon: Zap,
    title: 'Always available',
    description: '99.9% uptime with global edge infrastructure and automatic failover.',
  },
  {
    icon: Globe2,
    title: 'Global reach',
    description: 'Low-latency responses from data centers on every continent.',
  },
]

export function TrustSection() {
  return (
    <section className="relative py-24 px-4">
      {/* Stats */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="text-center glass rounded-2xl border border-border/40 p-6"
            >
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1"
                style={{ color: 'oklch(0.78 0.18 210)' }}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Trust points */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Built with trust at the core
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Security, privacy, and reliability are not afterthoughts at Tanzai — they&apos;re foundational.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trustPoints.map((tp, i) => {
            const Icon = tp.icon
            return (
              <motion.div
                key={tp.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}
                className="glass rounded-2xl border border-border/50 p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-accent border border-primary/20 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{tp.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tp.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
