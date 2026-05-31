'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, MessageSquare, Pencil, Trash2,
  ChevronDown, Settings, User, CreditCard, LogOut,
  MoreHorizontal, X, Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TanzaiLogo } from '@/components/tanzai-logo'

interface Chat {
  id: string
  title: string
  preview: string
  date: string
  active?: boolean
}

const recentChats: Chat[] = []

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function ChatSidebar({ open, onClose }: SidebarProps) {
  const [search, setSearch] = useState('')
  const [activeChat, setActiveChat] = useState('')
  const [contextMenu, setContextMenu] = useState<string | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [memoryEnabled, setMemoryEnabled] = useState(true)

  const filtered = recentChats.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.preview.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = filtered.reduce<Record<string, Chat[]>>((acc, chat) => {
    if (!acc[chat.date]) acc[chat.date] = []
    acc[chat.date].push(chat)
    return acc
  }, {})

  return (
    <>
      {/* Mobile backdrop */}
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

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 flex flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out',
          'lg:relative lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Chat navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border flex-shrink-0">
          <TanzaiLogo size={22} textSize="text-base" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMemoryEnabled(!memoryEnabled)}
              title={memoryEnabled ? 'Memory on' : 'Memory off'}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                memoryEnabled ? 'text-primary bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
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

        {/* New chat button */}
        <div className="px-3 pt-3 pb-2 flex-shrink-0">
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-accent hover:bg-accent/80 text-sidebar-accent-foreground text-sm font-medium transition-colors border border-sidebar-border/50 group">
            <Plus size={15} className="text-primary group-hover:rotate-90 transition-transform duration-200" />
            New conversation
          </button>
        </div>

        {/* Search */}
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

        {/* Chat list */}
        <nav className="flex-1 overflow-y-auto px-2 pb-2 space-y-4" aria-label="Recent chats">
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center">
              <MessageSquare size={22} className="mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-xs font-medium text-sidebar-foreground">No conversations yet</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Start a new chat to build your Tanzai workspace.</p>
            </div>
          )}
          {Object.entries(grouped).map(([date, chats]) => (
            <div key={date}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 px-2 mb-1.5">
                {date}
              </p>
              <ul className="space-y-0.5">
                {chats.map((chat) => (
                  <li key={chat.id} className="relative group">
                    <button
                      onClick={() => setActiveChat(chat.id)}
                      className={cn(
                        'w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all',
                        activeChat === chat.id
                          ? 'bg-accent text-sidebar-accent-foreground'
                          : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-accent/50'
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <MessageSquare size={13} className="flex-shrink-0 mt-0.5 text-primary/60" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs leading-snug truncate text-sidebar-foreground">
                            {chat.title}
                          </p>
                          <p className="text-xs text-muted-foreground/60 truncate mt-0.5 leading-tight">
                            {chat.preview}
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Context menu trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setContextMenu(contextMenu === chat.id ? null : chat.id)
                      }}
                      aria-label="Chat options"
                      className={cn(
                        'absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-border/50 transition-all',
                        contextMenu === chat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      )}
                    >
                      <MoreHorizontal size={13} />
                    </button>

                    {/* Context menu */}
                    <AnimatePresence>
                      {contextMenu === chat.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -4 }}
                          transition={{ duration: 0.12 }}
                          className="absolute right-2 top-full z-50 mt-1 glass rounded-xl border border-border/60 shadow-xl overflow-hidden py-1 w-40"
                        >
                          <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors">
                            <Pencil size={12} /> Rename
                          </button>
                          <button
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                            onClick={() => setContextMenu(null)}
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User profile */}
        <div className="border-t border-sidebar-border px-3 py-3 flex-shrink-0 relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-accent transition-colors group"
            aria-expanded={profileOpen}
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-full bg-accent border border-primary/25 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium text-sidebar-foreground truncate">Tanzai User</p>
              <p className="text-[10px] text-muted-foreground truncate">Starter plan</p>
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
                  <CreditCard size={12} /> Upgrade to Pro
                </Link>
                <div className="border-t border-border/40 my-1" />
                <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut size={12} /> Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </>
  )
}
