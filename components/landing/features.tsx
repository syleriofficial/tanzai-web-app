'use client'

import { motion } from 'framer-motion'
import {
  MessageSquare,
  Code2,
  FileSearch,
  ImageIcon,
  Mic,
  Brain,
  Globe2,
  Zap,
} from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'AI Chat',
    description:
      'Fast, focused conversations for research, writing, planning, and everyday reasoning.',
    color: 'oklch(0.72 0.18 210)',
    status: 'Live',
  },
  {
    icon: Code2,
    title: 'Coding Help',
    description:
      'Explain errors, draft functions, review snippets, and reason through implementation choices.',
    color: 'oklch(0.68 0.19 180)',
    status: 'Live',
  },
  {
    icon: FileSearch,
    title: 'File Analysis',
    description:
      'Document upload and retrieval workflows are planned for the next product phase.',
    color: 'oklch(0.65 0.20 240)',
    status: 'Soon',
  },
  {
    icon: ImageIcon,
    title: 'Image Understanding',
    description:
      'Image reasoning is on the roadmap after the core chat workspace stabilizes.',
    color: 'oklch(0.70 0.17 160)',
    status: 'Soon',
  },
  {
    icon: Mic,
    title: 'Voice Assistant',
    description:
      'Voice input will arrive after text chat, billing, and saved conversations are solid.',
    color: 'oklch(0.73 0.16 195)',
    status: 'Soon',
  },
  {
    icon: Brain,
    title: 'Memory',
    description:
      'Saved context and long-term preferences will be introduced with clear user controls.',
    color: 'oklch(0.68 0.21 220)',
    status: 'Planned',
  },
  {
    icon: Globe2,
    title: 'Multilingual',
    description:
      'Ask questions and draft responses across languages supported by the engine.',
    color: 'oklch(0.72 0.18 200)',
    status: 'Live',
  },
  {
    icon: Zap,
    title: 'Productivity',
    description:
      'Turn rough notes into sharper drafts, checklists, summaries, and next steps.',
    color: 'oklch(0.75 0.16 175)',
    status: 'Live',
  },
]

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
    },
  },
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/80 mb-3 block">
            Capabilities
          </span>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Everything you need to think deeper
          </h2>

          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Tanzai integrates every modality — text, code, voice, image, and memory —
            into one seamless experience.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="group bg-card rounded-xl border border-border p-6 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${feature.color}18`,
                      border: `1px solid ${feature.color}30`,
                    }}
                  >
                    <Icon
                      size={18}
                      style={{
                        color: feature.color,
                      }}
                    />
                  </div>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {feature.status}
                  </span>
                </div>

                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
