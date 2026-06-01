'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Briefcase, Code2, PenTool, FlaskConical, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const useCases = [
  {
    id: 'students',
    icon: GraduationCap,
    label: 'Students',
    headline: 'Ace every subject with AI clarity',
    description: 'Understand complex topics, get step-by-step explanations, summarize textbooks, and generate practice questions. Tanzai makes learning faster and deeper.',
    points: ['Explain concepts simply', 'Generate practice problems', 'Summarize research papers', 'Essay drafting & editing'],
  },
  {
    id: 'professionals',
    icon: Briefcase,
    label: 'Professionals',
    headline: 'Work at the speed of thought',
    description: 'Draft reports, analyze data, prepare presentations, and communicate with clarity. Tanzai handles the cognitive load so you can focus on decisions.',
    points: ['Meeting summaries', 'Report generation', 'Email drafting', 'Strategic analysis'],
  },
  {
    id: 'developers',
    icon: Code2,
    label: 'Developers',
    headline: 'Ship code faster with an AI pair',
    description: 'Debug errors, understand codebases, generate boilerplate, and get architectural guidance. Tanzai speaks your programming language.',
    points: ['Code review & debugging', 'Documentation generation', 'Architecture guidance', 'Test case creation'],
  },
  {
    id: 'creators',
    icon: PenTool,
    label: 'Creators',
    headline: 'From blank page to brilliant work',
    description: 'Brainstorm ideas, develop storylines, refine tone and voice, and build creative projects with an AI collaborator that understands nuance.',
    points: ['Brainstorming sessions', 'Tone & style refinement', 'SEO content creation', 'Script & copy writing'],
  },
  {
    id: 'researchers',
    icon: FlaskConical,
    label: 'Researchers',
    headline: 'Accelerate discovery and synthesis',
    description: 'Analyze literature, extract insights from datasets, generate hypotheses, and communicate findings. Tanzai keeps pace with your thinking.',
    points: ['Literature synthesis', 'Data interpretation', 'Hypothesis generation', 'Academic writing'],
  },
  {
    id: 'enterprise',
    icon: Building2,
    label: 'Enterprise',
    headline: 'Intelligence at organizational scale',
    description: 'Deploy Tanzai across teams with admin controls, usage insights, and enterprise-grade security. Bring AI fluency to your entire organization.',
    points: ['Team workspaces', 'Admin dashboard', 'Usage analytics', 'Enterprise security'],
  },
]

export function UseCasesSection() {
  const [active, setActive] = useState('students')
  const activeCase = useCases.find((u) => u.id === active)!

  return (
    <section id="use-cases" className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/80 mb-3 block">
            Use Cases
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance">
            Built for how you actually work
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed text-pretty">
            Whether you&apos;re learning, building, writing, or leading — Tanzai adapts to your workflow.
          </p>
        </div>

        {/* Tab strip */}
        <div className="flex items-center gap-2 flex-wrap justify-center mb-10">
          {useCases.map((uc) => {
            const Icon = uc.icon
            const isActive = active === uc.id
            return (
              <button
                key={uc.id}
                onClick={() => setActive(uc.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground border border-border hover:border-border/80'
                )}
              >
                <Icon size={14} />
                {uc.label}
              </button>
            )
          })}
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass rounded-2xl border border-border/50 p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center"
          >
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 text-balance">
                {activeCase.headline}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {activeCase.description}
              </p>
              <ul className="space-y-2.5">
                {activeCase.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden md:block">
              {/* Decorative mock panel */}
              <div className="rounded-xl border border-border/50 bg-secondary/40 p-6 space-y-3">
                <div className="h-3 bg-muted rounded-full w-3/4 shimmer" />
                <div className="h-3 bg-muted rounded-full w-full shimmer" style={{ animationDelay: '0.1s' }} />
                <div className="h-3 bg-muted rounded-full w-5/6 shimmer" style={{ animationDelay: '0.2s' }} />
                <div className="mt-4 h-20 bg-accent/40 rounded-lg border border-primary/15 flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary/60 thinking-dot" />
                    <div className="w-2 h-2 rounded-full bg-primary/60 thinking-dot" />
                    <div className="w-2 h-2 rounded-full bg-primary/60 thinking-dot" />
                  </div>
                </div>
                <div className="h-3 bg-muted rounded-full w-2/3 shimmer" style={{ animationDelay: '0.3s' }} />
                <div className="h-3 bg-muted rounded-full w-full shimmer" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
