'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check, Code2, FileText, Lock, MessageSquare, Sparkles } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
}

const workflow = [
  { icon: MessageSquare, label: 'Ask', value: 'Deep answers' },
  { icon: Code2, label: 'Build', value: 'Code support' },
  { icon: FileText, label: 'Shape', value: 'Drafts & plans' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden px-4 pt-24 pb-14">
      <div className="absolute inset-x-0 top-0 h-px bg-primary/40" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(oklch(0.72 0.18 210 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.18 210 / 0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-14 items-center">
        <motion.div
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.12 }}
          className="text-center lg:text-left"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-card border border-border text-muted-foreground">
              <Sparkles size={12} className="text-primary" />
              Powered by Syleri Engine
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.04]"
          >
            A focused AI workspace for serious thinking
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed text-pretty"
          >
            Tanzai helps you reason through questions, write sharper drafts, and turn ideas
            into useful work without losing the thread.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-col sm:flex-row items-center lg:items-start gap-3">
            <Link
              href="/signup"
              className="group flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
            >
              Start free
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors px-6 py-3 rounded-xl border border-border bg-card/70"
            >
              Open workspace
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-2xl mx-auto lg:mx-0">
            {workflow.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="rounded-xl border border-border bg-card/60 px-4 py-3 text-left">
                  <div className="flex items-center gap-2 text-xs text-primary font-medium">
                    <Icon size={13} />
                    {item.label}
                  </div>
                  <p className="mt-1 text-sm text-foreground">{item.value}</p>
                </div>
              )
            })}
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="relative"
        >
          <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/70">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-muted-foreground">Tanzai workspace</span>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Lock size={11} />
                Private
              </div>
            </div>

            <div className="grid md:grid-cols-[180px_1fr] min-h-[430px]">
              <aside className="hidden md:block border-r border-border bg-background/45 p-3">
                <button className="w-full rounded-lg bg-accent border border-primary/20 px-3 py-2 text-xs text-primary text-left">
                  New conversation
                </button>
                <div className="mt-4 space-y-2">
                  {['Research plan', 'Landing page copy', 'Code review'].map((item) => (
                    <div key={item} className="rounded-lg border border-border bg-card/70 px-3 py-2">
                      <p className="text-xs text-foreground truncate">{item}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Saved thread</p>
                    </div>
                  ))}
                </div>
              </aside>

              <div className="p-5 sm:p-6 flex flex-col">
                <div className="space-y-5 flex-1">
                  <div className="flex justify-end">
                    <div className="max-w-sm rounded-2xl rounded-tr-sm border border-primary/20 bg-primary/15 px-4 py-3 text-sm">
                      Turn this raw product idea into a clear launch plan.
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-accent border border-primary/25 flex items-center justify-center flex-shrink-0">
                      <Sparkles size={14} className="text-primary" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed text-foreground">
                        Here is a focused plan: define the first workflow, ship a reliable chat
                        loop, measure usage, then expand into files and memory.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {['Clarify the promise', 'Build the chat core', 'Add billing carefully', 'Launch with trust'].map((item) => (
                          <div key={item} className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2 text-xs text-foreground">
                            <Check size={12} className="text-primary" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-border bg-background/70 p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex-1">Ask Tanzai anything...</span>
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
