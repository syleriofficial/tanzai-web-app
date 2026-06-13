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
  Pin,
  PinOff,
  X,
  Pencil,
  Trash2,
} from 'lucide-react'
import { type User as SupabaseUser } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'
import { createBrowserClient } from '@/lib/supabase'
import { TanzaiLogo } from '@/components/tanzai-logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { LogoutButton } from '@/components/logout-button'

interface Chat {
  id: string
  pinned?: boolean
  title: string
  preview: string
  date: string
}

interface SidebarProps {
  open: boolean
  onClose: () => void
  conversations: Chat[]
  activeConversationId: string
  onNewConversation: () => void
  onSelectConversation: (id: string) => void
  onRenameConversation: (id: string, title: string) => void
  onDeleteConversation: (id: string) => void
  onTogglePinConversation: (id: string) => void
}

export function ChatSidebar({
  open,
  onClose,
  conversations,
  activeConversationId,
  onNewConversation,
  onSelectConversation,
  onRenameConversation,
  onDeleteConversation,
  onTogglePinConversation,
}: SidebarProps) {
  const [search, setSearch] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [renamingChat, setRenamingChat] = useState<Chat | null>(null)
  const [renameTitle, setRenameTitle] = useState('')
  const [deletingChat, setDeletingChat] = useState<Chat | null>(null)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [supabase] = useState(() => createBrowserClient())

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

  const filtered = conversations
    .filter(
      (c) =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.preview.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))

  return (
    <>
      <AnimatePresence>
        {renamingChat && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl"
            >
              <h2 className="text-sm font-semibold text-foreground">Rename chat</h2>
              <input
                autoFocus
                value={renameTitle}
                onChange={(event) => setRenameTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && renameTitle.trim()) {
                    onRenameConversation(renamingChat.id, renameTitle.trim())
                    setRenamingChat(null)
                  }
                  if (event.key === 'Escape') setRenamingChat(null)
                }}
                className="mt-4 w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                aria-label="Chat title"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setRenamingChat(null)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50"
                  disabled={!renameTitle.trim()}
                  onClick={() => {
                    onRenameConversation(renamingChat.id, renameTitle.trim())
                    setRenamingChat(null)
                  }}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingChat && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl"
            >
              <h2 className="text-sm font-semibold text-foreground">Delete chat?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                This removes the conversation from your Tanzai workspace.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setDeletingChat(null)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-xl bg-destructive px-3 py-2 text-xs font-medium text-destructive-foreground"
                  onClick={() => {
                    onDeleteConversation(deletingChat.id)
                    setDeletingChat(null)
                  }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

          <button
            className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={15} />
          </button>
        </div>

        <div className="px-3 pt-3 pb-2 flex-shrink-0">
          <button
            onClick={() => {
              onNewConversation()
              onClose()
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-accent hover:bg-accent/80 text-sidebar-accent-foreground text-sm font-medium transition-colors border border-sidebar-border/50 group"
          >
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
                {search ? 'No matching chats' : 'No conversations yet'}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {search ? 'Try a different search.' : 'Start a new conversation with Tanzai.'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    'group rounded-xl transition-colors',
                    chat.id === activeConversationId
                      ? 'bg-accent text-sidebar-accent-foreground'
                      : 'hover:bg-accent/60 text-sidebar-foreground'
                  )}
                >
                  <button
                    onClick={() => {
                      onSelectConversation(chat.id)
                      onClose()
                    }}
                    className="w-full px-3 py-2.5 text-left"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-xs font-medium">
                        {chat.pinned ? 'Pinned · ' : ''}
                        {chat.title}
                      </p>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {chat.date}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                      {chat.preview}
                    </p>
                  </button>

                  <div className="flex items-center gap-1 px-2 pb-2 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                    <button
                      onClick={() => onTogglePinConversation(chat.id)}
                      className="rounded-md p-1 text-muted-foreground hover:bg-background/70 hover:text-foreground"
                      aria-label={chat.pinned ? 'Unpin chat' : 'Pin chat'}
                      title={chat.pinned ? 'Unpin chat' : 'Pin chat'}
                    >
                      {chat.pinned ? <PinOff size={12} /> : <Pin size={12} />}
                    </button>
                    <button
                      onClick={() => {
                        setRenamingChat(chat)
                        setRenameTitle(chat.title)
                      }}
                      className="rounded-md p-1 text-muted-foreground hover:bg-background/70 hover:text-foreground"
                      aria-label="Rename chat"
                      title="Rename chat"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => {
                        setDeletingChat(chat)
                      }}
                      className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete chat"
                      title="Delete chat"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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

          <div className="mt-3 flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  )
}
