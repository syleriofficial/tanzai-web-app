'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  MessageSquare,
  ChevronDown,
  Settings,
  User,
  CreditCard,
  X,
  Brain,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { TanzaiLogo } from '@/components/tanzai-logo'
import { LogoutButton } from '@/components/logout-button'

interface Chat {
  id: string
  title: string
  preview: string
  date: string
}

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function ChatSidebar({ open, onClose }: SidebarProps) {
  const [search, setSearch] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [memoryEnabled, setMemoryEnabled] = useState(true)
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

  const avatarLetter = displayName.charAt(0).toUpperCase()

  const conversations: Chat[] = []

  const filtered = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.preview.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 flex flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out',
          'lg:relative lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Chat navigation"
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border flex-shrink-0">
          <TanzaiLogo size={22} textSize="text-base" />

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMemoryEnabled(!memoryEnabled)}
              title={memoryEnabled ? 'Memory on' : 'Memory off'}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                memoryEnabled
                  ? 'text-primary bg-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
              aria-label="Toggle memory"
            >
              <Brain size={15} />
            </button>

            <button
              className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="px-3 pt-3 pb-2 flex-shrink-0">
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-accent hover:bg-accent/80 text-sidebar-accent-foreground text-sm font-medium transition-colors border border-sidebar-border/50 group">
            <Plus size={15} className="text-primary group-hover:rotate-90 transition-transform duration-200" />
            New conversation
          </button>
        </div>

        <div className="px-3 pb-2 flex-shrink-0">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-input border border-border/60 rounded-lg pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              aria-label="Search conversations"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-2" aria-label="Recent chats">
          {filtered.length === 0 ? (
            <div className="mt-4 rounded-xl border border-sidebar-border/50 bg-accent/30 px-3 py-4 text-center">
              <MessageSquare size={16} className="mx-auto mb-2 text-primary/70" />
              <p className="text-xs font-medium text-sidebar-foreground">
                No conversations yet
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Start a new conversation with Tanzai.
              </p>
            </div>
          ) : null}
        </nav>

        <div className="border-t border-sidebar-border px-3 py-3 flex-shrink-0 relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-accent transition-colors group"
            aria-expanded={profileOpen}
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-full bg-accent border border-primary/25 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
              {avatarLetter}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium text-sidebar-foreground truncate">
                {displayName}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                Tanzai User
              </p>
            </div>

            <ChevronDown
              size={13}
              className={cn('text-muted-foreground transition-transform', profileOpen && 'rotate-180')}
            />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.12 }}
                className="absolute bottom-full left-3 right-3 mb-1 glass rounded-xl border border-border/60 shadow-xl overflow-hidden py-1"
              >
                <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors">
                  <User size={12} /> Profile
                </Link>

                <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors">
                  <Settings size={12} /> Settings
                </Link>

                <Link href="/pricing" className="flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors">
                  <CreditCard size={12} /> Upgrade
                </Link>

                <div className="border-t border-border/40 my-1" />

                <div className="px-3 py-2">
                  <LogoutButton />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </>
  )
}
