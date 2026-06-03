'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, MessageSquare, Calendar, Brain,
  FileText, Zap, Edit3, Settings, ExternalLink
} from 'lucide-react'
import { TanzaiLogo } from '@/components/tanzai-logo'
import { LogoutButton } from '@/components/logout-button'

const stats = [
  { label: 'Conversations', value: '284', icon: MessageSquare },
  { label: 'Messages sent', value: '1,842', icon: Zap },
  { label: 'Files analyzed', value: '37', icon: FileText },
  { label: 'Days active', value: '48', icon: Calendar },
]

const recentChats = [
  { title: 'Quantum entanglement explained', date: 'Today', messages: 12 },
  { title: 'React Server Components guide', date: 'Today', messages: 8 },
  { title: 'Marketing strategy for SaaS', date: 'Yesterday', messages: 24 },
  { title: 'Python pandas tutorial', date: 'Jun 3', messages: 16 },
  { title: 'Stoic philosophy & productivity', date: 'Jun 2', messages: 31 },
]

const memories = [
  'Prefers concise, technical explanations',
  'Working on a React SaaS application',
  'Background in physics research',
  'Based in San Francisco',
  'Interested in philosophy and productivity',
]

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/chat" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Back to chat">
            <ArrowLeft size={18} />
          </Link>
          <TanzaiLogo size={22} textSize="text-base" />
          <div className="flex-1" />
          <Link href="/settings" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Settings size={14} /> Settings
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl border border-border/50 p-7 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-accent border-2 border-primary/25 flex items-center justify-center text-3xl font-bold text-primary">
                A
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary border-2 border-background flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground">Alex Johnson</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                  Free plan
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">alex@example.com</p>
              <p className="text-sm text-foreground mt-2">Researcher, builder, and curious mind.</p>
              <p className="text-xs text-muted-foreground mt-1">Member since May 2024 · San Francisco, US</p>
            </div>
            <div className="flex gap-2 flex-shrink-0 flex-wrap">
              <Link
                href="/settings"
                className="flex items-center gap-1.5 text-sm text-muted-foreground border border-border px-3 py-2 rounded-xl hover:text-foreground hover:border-border/80 transition-all"
              >
                <Edit3 size={13} /> Edit profile
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-1.5 text-sm text-primary border border-primary/30 px-3 py-2 rounded-xl hover:bg-accent transition-all"
              >
                Upgrade
              </Link>
              
              <div className="border border-red-500/30 px-3 py-2 rounded-xl">
  <LogoutButton />
</div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="glass rounded-2xl border border-border/50 p-5 text-center"
              >
                <Icon size={18} className="text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground mb-0.5">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent chats */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-2xl border border-border/50 p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-foreground">Recent conversations</h2>
              <Link href="/chat" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ExternalLink size={10} />
              </Link>
            </div>
            <ul className="space-y-2">
              {recentChats.map((chat) => (
                <li key={chat.title}>
                  <Link
                    href="/chat"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent/50 transition-colors group"
                  >
                    <MessageSquare size={13} className="text-primary/60 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {chat.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{chat.date} · {chat.messages} messages</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Memory */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="glass rounded-2xl border border-border/50 p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-foreground">What Tanzai knows about you</h2>
              <Link href="/settings?section=memory" className="text-xs text-primary hover:underline flex items-center gap-1">
                Manage <ExternalLink size={10} />
              </Link>
            </div>
            <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-accent/50 rounded-xl border border-primary/15">
              <Brain size={14} className="text-primary flex-shrink-0" />
              <span className="text-xs text-foreground">Memory is active — {memories.length} items stored</span>
            </div>
            <ul className="space-y-2">
              {memories.map((m) => (
                <li
                  key={m}
                  className="flex items-start gap-2.5 px-3 py-2.5 bg-muted/30 rounded-xl border border-border/30"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0 mt-1.5" />
                  <span className="text-xs text-foreground leading-snug">{m}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Usage bar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 glass rounded-2xl border border-border/50 p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-semibold text-foreground mb-0.5">Daily usage</h2>
              <p className="text-xs text-muted-foreground">23 of 50 free messages used today</p>
            </div>
            <Link href="/pricing" className="text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
              Get unlimited
            </Link>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: '46%' }}
              role="progressbar"
              aria-valuenow={23}
              aria-valuemin={0}
              aria-valuemax={50}
              aria-label="Daily message usage"
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
            <span>23 used</span>
            <span>27 remaining</span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
