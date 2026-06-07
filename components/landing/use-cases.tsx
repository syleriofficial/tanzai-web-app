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
    headline: 'Turn difficult topics into clear study notes',
    description: 'Ask follow-up questions, simplify concepts, and shape rough notes into study-ready explanations.',
    points: ['Explain concepts simply', 'Generate practice questions', 'Create study outlines', 'Improve drafts'],
  },
  {
    id: 'professionals',
    icon: Briefcase,
    label: 'Professionals',
    headline: 'Move from raw thinking to polished output',
    description: 'Use Tanzai to structure ideas, draft communication, and prepare sharper decisions.',
    points: ['Briefing notes', 'Report outlines', 'Email drafting', 'Decision framing'],
  },
  {
    id: 'developers',
    icon: Code2,
    label: 'Developers',
    headline: 'Reason through code with a calmer partner',
    description: 'Ask for explanations, review snippets, draft functions, and compare implementation tradeoffs.',
    points: ['Debugging help', 'Code explanation', 'Architecture notes', 'Test ideas'],
  },
  {
    id: 'creators',
    icon: PenTool,
    label: 'Creators',
    headline: 'Get unstuck without losing your voice',
    description: 'Brainstorm, outline, rewrite, and refine creative work while keeping direction in your hands.',
    points: ['Brainstorming', 'Tone refinement', 'Content outlines', 'Copy editing'],
  },
  {
    id: 'researchers',
    icon: FlaskConical,
    label: 'Researchers',
    headline: 'Organize questions before the deep work',
    description: 'Use Tanzai to clarify assumptions, outline research paths, and turn scattered notes into next steps.',
    points: ['Research outlines', 'Question mapping', 'Summary drafting', 'Argument structure'],
  },
  {
    id: 'enterprise',
    icon: Building2,
    label: 'Enterprise',
    headline: 'Prepare team workflows for AI',
    description: 'Team plans are being shaped around shared billing, usage visibility, and controlled rollout.',
    points: ['Shared workflows planned', 'Admin controls planned', 'Usage analytics planned', 'Secure deployment path'],
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
            className="bg-card rounded-2xl border border-border p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center"
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
              <div className="rounded-xl border border-border bg-background/60 p-5 space-y-3">
                <div className="rounded-lg border border-border bg-card px-4 py-3">
                  <p className="text-xs text-muted-foreground">Prompt</p>
                  <p className="mt-1 text-sm text-foreground">Create a focused plan for this workflow.</p>
                </div>
                <div className="rounded-lg border border-primary/20 bg-accent/35 px-4 py-3">
                  <p className="text-xs text-primary">Tanzai output</p>
                  <ul className="mt-2 space-y-2">
                    {activeCase.points.slice(0, 3).map((point) => (
                      <li key={point} className="text-sm text-foreground">{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
