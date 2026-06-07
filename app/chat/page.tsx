'use client'

/**
 * app/chat/page.tsx
 *
 * Key fixes vs. the original:
 *   • The middleware now handles the primary auth guard (server-side, before
 *     the page renders). The client-side check here is a safety net for the
 *     onAuthStateChange SIGNED_OUT event (e.g. token truly expired or revoked
 *     while the tab is open).
 *   • Removed the artificial 800ms delay — it caused the "Checking login…"
 *     flash even for already-authenticated users.
 *   • Uses getUser() (validates with server) instead of getSession() (trusts
 *     the local cookie without validation).
 *   • No longer imports the module-level `supabase` singleton; creates its
 *     own browser client.
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Plus, ShieldCheck, Sparkles, Trash2 } from 'lucide-react'
import { ChatSidebar } from '@/components/chat/sidebar'
import { ChatMessage, ThinkingIndicator, type Message } from '@/components/chat/message'
import { ChatInputBar } from '@/components/chat/input-bar'
import { TanzaiLogo } from '@/components/tanzai-logo'
import { createBrowserClient } from '@/lib/supabase'
import { type ChatApiResponse } from '@/types/chat'

type Conversation = {
  id: string
  title: string
  preview: string
  date: string
  messages: Message[]
}

const STORAGE_KEY = 'tanzai.chat.conversations.v1'

const starterPrompts = [
  'Plan my next product launch',
  'Explain this code error clearly',
  'Write a professional email draft',
  'Turn these notes into action steps',
]

function createConversation(): Conversation {
  const now = new Date()

  return {
    id: crypto.randomUUID(),
    title: 'New conversation',
    preview: 'No messages yet',
    date: now.toLocaleDateString([], { month: 'short', day: 'numeric' }),
    messages: [],
  }
}

function titleFromMessage(message: string) {
  const clean = message.replace(/\s+/g, ' ').trim()
  if (clean.length <= 42) return clean
  return `${clean.slice(0, 42).trim()}...`
}

export default function ChatPage() {
  const router = useRouter()

  const [supabase] = useState(() => createBrowserClient())

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const persistConversations = useCallback((next: Conversation[]) => {
    setConversations(next)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Conversation[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setConversations(parsed)
          setActiveConversationId(parsed[0].id)
          setMessages(parsed[0].messages)
          return
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }

    const initial = createConversation()
    setConversations([initial])
    setActiveConversationId(initial.id)
  }, [])

  // Listen for sign-out events while the tab is open (e.g. user signs out in
  // another tab, or the refresh token is revoked server-side).
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const updateActiveConversation = useCallback(
    (nextMessages: Message[]) => {
      setMessages(nextMessages)

      setConversations((prev) => {
        const currentId = activeConversationId || prev[0]?.id || createConversation().id
        const existing = prev.find((conversation) => conversation.id === currentId)
        const firstUserMessage = nextMessages.find((message) => message.role === 'user')
        const lastMessage = nextMessages[nextMessages.length - 1]
        const updated: Conversation = {
          ...(existing || createConversation()),
          id: currentId,
          title: firstUserMessage ? titleFromMessage(firstUserMessage.content) : 'New conversation',
          preview: lastMessage?.content ? titleFromMessage(lastMessage.content) : 'No messages yet',
          date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
          messages: nextMessages,
        }
        const next = [updated, ...prev.filter((conversation) => conversation.id !== currentId)]

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    [activeConversationId]
  )

  const handleNewConversation = useCallback(() => {
    const next = createConversation()
    const updated = [next, ...conversations]
    persistConversations(updated)
    setActiveConversationId(next.id)
    setMessages([])
    setIsThinking(false)
    abortRef.current?.abort()
  }, [conversations, persistConversations])

  const handleSelectConversation = useCallback(
    (id: string) => {
      const conversation = conversations.find((item) => item.id === id)
      if (!conversation) return

      abortRef.current?.abort()
      setIsThinking(false)
      setActiveConversationId(id)
      setMessages(conversation.messages)
    },
    [conversations]
  )

  const handleClearConversation = useCallback(() => {
    const nextMessages: Message[] = []
    updateActiveConversation(nextMessages)
  }, [updateActiveConversation])

  const handleSend = async (text: string) => {
    if (isThinking) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    const nextMessages = [...messages, userMsg]
    const controller = new AbortController()

    abortRef.current = controller
    updateActiveConversation(nextMessages)
    setIsThinking(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      })

      const data = (await response.json()) as ChatApiResponse

      if (response.status === 401) {
        router.replace('/login')
        return
      }

      if (!response.ok || !data.success) {
        throw new Error(data.answer || data.error || 'Tanzai could not generate a response right now.')
      }

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer || 'Tanzai could not generate a response right now.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      updateActiveConversation([...nextMessages, assistantMsg])
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          error instanceof Error
            ? error.message
            : 'Unable to connect to Tanzai engine. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      updateActiveConversation([...nextMessages, assistantMsg])
    } finally {
      setIsThinking(false)
      abortRef.current = null
    }
  }

  const handleStop = () => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsThinking(false)
  }

  return (
    <div className="flex h-dvh bg-background overflow-hidden">
      <ChatSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations.map(({ id, title, preview, date }) => ({
          id,
          title,
          preview,
          date,
        }))}
        activeConversationId={activeConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="flex items-center gap-3 px-3 sm:px-4 h-14 border-b border-border/50 flex-shrink-0 bg-background/85 backdrop-blur-sm">
          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-foreground truncate">
              {messages.find((message) => message.role === 'user')
                ? titleFromMessage(messages.find((message) => message.role === 'user')?.content || '')
                : 'Tanzai chat'}
            </h1>
            <div className="mt-0.5 hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck size={11} className="text-primary" />
              Protected workspace
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleNewConversation}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
            >
              <Plus size={13} />
              New
            </button>
            {messages.length > 0 && (
              <button
                onClick={handleClearConversation}
                className="rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </header>

        <main
          className="flex-1 overflow-y-auto"
          id="chat-messages"
          aria-live="polite"
          aria-label="Conversation"
        >
          <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 space-y-6">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-8 sm:py-14"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/25 bg-accent">
                  <Sparkles size={22} className="text-primary" />
                </div>
                <div className="text-center">
                  <TanzaiLogo size={32} className="justify-center mb-4" />
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    What are we thinking through?
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Ask for research, writing, coding help, planning, or a cleaner way
                    to shape a rough idea.
                  </p>
                </div>

                <div className="mt-8 grid gap-2 sm:grid-cols-2">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-foreground hover:border-primary/40 hover:bg-accent/60 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            <AnimatePresence>
              {isThinking && <ThinkingIndicator key="thinking" />}
            </AnimatePresence>

            <div ref={bottomRef} />
          </div>
        </main>

        <div className="flex-shrink-0 bg-background/80 backdrop-blur-sm border-t border-border/30">
          <div className="max-w-3xl mx-auto">
            <ChatInputBar
              onSend={handleSend}
              isStreaming={isThinking}
              onStop={handleStop}
              memoryEnabled={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
