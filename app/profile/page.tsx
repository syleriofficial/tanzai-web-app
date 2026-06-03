'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  MessageSquare,
  Calendar,
  Brain,
  FileText,
  Zap,
  Edit3,
  Settings,
  ExternalLink,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { TanzaiLogo } from '@/components/tanzai-logo'
import { LogoutButton } from '@/components/logout-button'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)
    }

    getUser()
  }, [])

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User'

  const email = user?.email || 'No email found'

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Recently'

  const avatarLetter = displayName.charAt(0).toUpperCase()

  const stats = [
    { label: 'Conversations', value: '0', icon: MessageSquare },
    { label: 'Messages sent', value: '0', icon: Zap },
    { label: 'Files analyzed', value: '0', icon: FileText },
    { label: 'Days active', value: '1', icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-background">
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl border border-border/50 p-7 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-accent border-2 border-primary/25 flex items-center justify-center text-3xl font-bold text-primary">
                {avatarLetter}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary border-2 border-background flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                  Free plan
                </span>
              </div>

              <p className="text-sm text-muted-foreground mt-1">{email}</p>
              <p className="text-sm text-foreground mt-2">Tanzai Member</p>
              <p className="text-xs text-muted-foreground mt-1">Member since {joinedDate}</p>
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
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-2xl border border-border/50 p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-foreground">Recent conversations</h2>
              <Link href="/chat" className="text-xs text-primary hover:underline flex items-center gap-1">
                Start chat <ExternalLink size={10} />
              </Link>
            </div>

            <div className="rounded-xl border border-border/40 bg-muted/20 p-4 text-sm text-muted-foreground">
              No conversations yet. Start your first chat with Tanzai.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="glass rounded-2xl border border-border/50 p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-foreground">Memory</h2>
              <Link href="/settings?section=memory" className="text-xs text-primary hover:underline flex items-center gap-1">
                Manage <ExternalLink size={10} />
              </Link>
            </div>

            <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-accent/50 rounded-xl border border-primary/15">
              <Brain size={14} className="text-primary flex-shrink-0" />
              <span className="text-xs text-foreground">Memory will appear here when Tanzai starts learning your preferences.</span>
            </div>

            <div className="rounded-xl border border-border/40 bg-muted/20 p-4 text-sm text-muted-foreground">
              No saved memories yet.
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 glass rounded-2xl border border-border/50 p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-semibold text-foreground mb-0.5">Daily usage</h2>
              <p className="text-xs text-muted-foreground">0 of 50 free messages used today</p>
            </div>

            <Link href="/pricing" className="text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
              Get unlimited
            </Link>
          </div>

          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: '0%' }}
              role="progressbar"
              aria-valuenow={0}
              aria-valuemin={0}
              aria-valuemax={50}
              aria-label="Daily message usage"
            />
          </div>

          <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
            <span>0 used</span>
            <span>50 remaining</span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
