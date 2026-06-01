'use client'

import { motion } from 'framer-motion'
import {
  MessageSquare, Code2, FileSearch, ImageIcon,
  Mic, Brain, Globe2, Zap
} from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'AI Chat',
    description: 'Natural, context-aware conversations that remember your preferences and build on previous exchanges.',
    color: 'oklch(0.72 0.18 210)',
  },
  {
    icon: Code2,
    title: 'Coding Help',
    description: 'Write, debug, and explain code in 40+ languages. Pair-program with an AI that understands your codebase.',
    color: 'oklch(0.68 0.19 180)',
  },
  {
    icon: FileSearch,
    title: 'File Analysis',
    description: 'Upload PDFs, spreadsheets, and documents. Get instant summaries, Q&A, and extracted insights.',
    color: 'oklch(0.65 0.20 240)',
  },
  {
    icon: ImageIcon,
    title: 'Image Understanding',
    description: 'Describe, analyze, and reason about images. From charts to photographs, Tanzai sees clearly.',
    color: 'oklch(0.70 0.17 160)',
  },
  {
    icon: Mic,
    title: 'Voice Assistant',
    description: 'Speak your questions naturally. Tanzai listens, understands, and responds in clear, spoken language.',
    color: 'oklch(0.73 0.16 195)',
  },
  {
    icon: Brain,
    title: 'Memory',
    description: 'Tanzai learns from your sessions. Build a persistent knowledge base that grows smarter with every conversation.',
    color: 'oklch(0.68 0.21 220)',
  },
  {
    icon: Globe2,
    title: 'Multilingual',
    description: 'Chat in over 90 languages. Tanzai translates, switches, and reasons across languages without losing context.',
    color: 'oklch(0.72 0.18 200)',
  },
  {
    icon: Zap,
    title: 'Productivity',
    description: 'Drafts, summaries, plans, and action lists. Turn raw ideas into structured outputs in seconds.',
    color: 'oklch(0.75 0.16 175)',
  },
]

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/80 mb-3 block">
            Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance">
            Everything you need to think deeper
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed text-pretty">
            Tanzai integrates every modality — text, code, voice, image, and memory — into one seamless experience.
          </p>
        </div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="group glass rounded-2xl border border-border/50 p-6 hover:border-primary/30 transition-all duration-300 cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feature.color}18`, border: `1px solid ${feature.color}30` }}
                >
                  <Icon size={18} style={{ color: feature.color }} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
