'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-16">
      {/* Background glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/4 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-blue-600/4 blur-[80px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(oklch(0.72 0.18 210 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.18 210 / 0.5) 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
          }}
        />
      </div>

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} className="mb-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-accent border border-accent-foreground/20 text-accent-foreground">
            <Sparkles size={12} />
            Next-generation AI intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.05]"
        >
          The AI that{' '}
          <span
            className="glow-text"
            style={{ color: 'oklch(0.78 0.18 210)' }}
          >
            thinks with you,
          </span>
          {' '}not for you
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed text-pretty"
        >
          Tanzai brings clarity to complex problems. Analyze files, write code, understand images, speak naturally — all in one intelligent workspace designed for deep work.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/signup"
            className="group flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all glow"
          >
            Start using Tanzai
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#features"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-6 py-3 rounded-xl border border-border hover:border-border/80"
          >
            See what it can do
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.p variants={fadeUp} className="mt-10 text-xs text-muted-foreground/70">
          Trusted by 50,000+ professionals across 120+ countries
        </motion.p>

        {/* Chat UI preview */}
        <motion.div
          variants={fadeUp}
          className="mt-16 w-full max-w-3xl"
        >
          <div className="glass rounded-2xl border border-border/50 overflow-hidden shadow-2xl">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-muted-foreground mx-auto">Tanzai</span>
            </div>
            {/* Chat messages preview */}
            <div className="p-5 space-y-4">
              {/* User message */}
              <div className="flex justify-end">
                <div className="max-w-xs bg-primary/15 border border-primary/20 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-foreground">
                  Explain quantum entanglement in simple terms
                </div>
              </div>
              {/* AI response */}
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-accent border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles size={12} className="text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-sm text-foreground leading-relaxed">
                    Imagine two coins that are magically linked. No matter how far apart they are — across the room or across galaxies — the moment you flip one, the other{' '}
                    <span style={{ color: 'oklch(0.78 0.18 210)' }}>instantly</span>{' '}
                    shows the opposite side. That instant connection, defying distance, is quantum entanglement.
                  </div>
                  {/* Thinking dots */}
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 thinking-dot" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 thinking-dot" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 thinking-dot" />
                  </div>
                </div>
              </div>
            </div>
            {/* Input bar */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 bg-muted/60 rounded-xl border border-border/60 px-4 py-2.5">
                <span className="flex-1 text-sm text-muted-foreground">Ask Tanzai anything...</span>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                    <ArrowRight size={13} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
