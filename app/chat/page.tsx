'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Plus, ShieldCheck, Sparkles, Trash2 } from 'lucide-react'
import { type User as SupabaseUser } from '@supabase/supabase-js'
import { ChatInputBar } from '@/components/chat/input-bar'
import { ChatMessage, ThinkingIndicator, type Message } from '@/components/chat/message'
import { ChatSidebar } from '@/components/chat/sidebar'
import { TanzaiLogo } from '@/components/tanzai-logo'
import { createBrowserClient } from '@/lib/supabase'
import { type EngineChatMessage } from '@/types/chat'

type ChatHistoryRow = {
  id: string
  user_id: string
  chat_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  title: string | null
  created_at: string
}

type Conversation = {
  id: string
  title: string
  preview: string
  date: string
  messages: Message[]
}

const starterPrompts = [
  'Plan my next product launch',
  'Explain this code error clearly',
  'Write a professional email draft',
  'Turn these notes into action steps',
]

function createEmptyConversation(): Conversation {
  return {
    id: crypto.randomUUID(),
    title: 'New conversation',
    preview: 'No messages yet',
    date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
    messages: [],
  }
}

function titleFromMessage(message: string) {
  const clean = message.replace(/\s+/g, ' ').trim()
  if (!clean) return 'New conversation'
  if (clean.length <= 48) return clean
  return `${clean.slice(0, 48).trim()}...`
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function groupRows(rows: ChatHistoryRow[]): Conversation[] {
  const grouped = new Map<string, ChatHistoryRow[]>()

  rows.forEach((row) => {
    grouped.set(row.chat_id, [...(grouped.get(row.chat_id) || []), row])
  })

  return Array.from(grouped.entries())
    .map(([chatId, chatRows]) => {
      const sorted = [...chatRows].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      const firstUser = sorted.find((row) => row.role === 'user')
      const last = sorted[sorted.length - 1]
      const title = sorted.find((row) => row.title)?.title || firstUser?.content || 'New conversation'

      return {
        id: chatId,
        createdAt: last?.created_at || '',
        title: titleFromMessage(title),
        preview: last?.content ? titleFromMessage(last.content) : 'No messages yet',
        date: last?.created_at ? formatDate(last.created_at) : '',
        messages: sorted.map((row) => ({
          id: row.id,
          role: (row.role === 'assistant' ? 'assistant' : 'user') as Message['role'],
          content: row.content,
          timestamp: formatTime(row.created_at),
        })),
      }
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(({ createdAt: _createdAt, ...conversation }) => conversation)
}

export default function ChatPage() {
  const router = useRouter()
  const [supabase] = useState(() => createBrowserClient())
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [error, setError] = useState('')

  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId),
    [activeConversationId, conversations]
  )

  const activeTitle =
    activeConversation?.title ||
    messages.find((message) => message.role === 'user')?.content ||
    'Tanzai chat'

  const setConversationState = useCallback((next: Conversation[]) => {
    setConversations(next)
    const active = next.find((conversation) => conversation.id === activeConversationId)
    if (active) {
      setMessages(active.messages)
    }
  }, [activeConversationId])

  const loadHistory = useCallback(
    async (currentUser: SupabaseUser) => {
      setLoadingHistory(true)
      setError('')

      const { data, error } = await supabase
        .from('chat_history')
        .select('id,user_id,chat_id,role,content,title,created_at')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: true })

      if (error) {
        setError('Chat history is not available yet.')
        const empty = createEmptyConversation()
        setConversations([empty])
        setActiveConversationId(empty.id)
        setMessages([])
        setLoadingHistory(false)
        return
      }

      const grouped = groupRows((data || []) as ChatHistoryRow[])
      const next = grouped.length > 0 ? grouped : [createEmptyConversation()]
      setConversations(next)
      setActiveConversationId(next[0].id)
      setMessages(next[0].messages)
      setLoadingHistory(false)
    },
    [supabase]
  )

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        router.replace('/login')
        return
      }

      setUser(user)
      loadHistory(user)
    })
  }, [loadHistory, router, supabase])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const upsertLocalConversation = useCallback(
    (chatId: string, nextMessages: Message[], title?: string) => {
      const lastMessage = nextMessages[nextMessages.length - 1]
      const firstUserMessage = nextMessages.find((message) => message.role === 'user')
      const nextTitle = title || activeConversation?.title || titleFromMessage(firstUserMessage?.content || '')
      const nextConversation: Conversation = {
        id: chatId,
        title: nextTitle,
        preview: lastMessage?.content ? titleFromMessage(lastMessage.content) : 'No messages yet',
        date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
        messages: nextMessages,
      }

      setMessages(nextMessages)
      setConversations((prev) => [
        nextConversation,
        ...prev.filter((conversation) => conversation.id !== chatId),
      ])
      setActiveConversationId(chatId)
    },
    [activeConversation?.title]
  )

  const handleNewConversation = useCallback(() => {
    const next = createEmptyConversation()
    abortRef.current?.abort()
    setError('')
    setIsThinking(false)
    setConversations((prev) => [next, ...prev.filter((conversation) => conversation.messages.length > 0)])
    setActiveConversationId(next.id)
    setMessages([])
  }, [])

  const handleSelectConversation = useCallback(
    (id: string) => {
      const conversation = conversations.find((item) => item.id === id)
      if (!conversation) return

      abortRef.current?.abort()
      setError('')
      setIsThinking(false)
      setActiveConversationId(id)
      setMessages(conversation.messages)
    },
    [conversations]
  )

  const handleRenameConversation = useCallback(
    async (id: string, title: string) => {
      if (!user) return

      const clean = titleFromMessage(title)
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === id ? { ...conversation, title: clean } : conversation
        )
      )

      await supabase
        .from('chat_history')
        .update({ title: clean })
        .eq('user_id', user.id)
        .eq('chat_id', id)
    },
    [supabase, user]
  )

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      if (!user) return

      await supabase.from('chat_history').delete().eq('user_id', user.id).eq('chat_id', id)

      setConversations((prev) => {
        const next = prev.filter((conversation) => conversation.id !== id)
        const fallback = next[0] || createEmptyConversation()
        if (id === activeConversationId) {
          setActiveConversationId(fallback.id)
          setMessages(fallback.messages)
        }
        return next.length > 0 ? next : [fallback]
      })
    },
    [activeConversationId, supabase, user]
  )

  const handleClearConversation = useCallback(() => {
    if (activeConversationId) {
      handleDeleteConversation(activeConversationId)
    }
  }, [activeConversationId, handleDeleteConversation])

  const handleSend = async (text: string) => {
    if (isThinking || !user) return

    const chatId = activeConversationId || crypto.randomUUID()
    const firstUserMessage = messages.find((message) => message.role === 'user')
    const title = activeConversation?.title && activeConversation.title !== 'New conversation'
      ? activeConversation.title
      : titleFromMessage(firstUserMessage?.content || text)
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    const nextMessages = [...messages, userMsg]
    const controller = new AbortController()

    abortRef.current = controller
    setError('')
    setIsThinking(true)
    upsertLocalConversation(chatId, nextMessages, title)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          Accept: 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          title,
          message: text,
          messages: nextMessages.map(
            (message): EngineChatMessage => ({
              role: message.role,
              content: message.content,
            })
          ),
        }),
        signal: controller.signal,
      })

      if (response.status === 401) {
        router.replace('/login')
        return
      }

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.answer || 'Tanzai could not generate a response right now.')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      const assistantId = crypto.randomUUID()
      let answer = ''
      let streamedMessages = [
        ...nextMessages,
        {
          id: assistantId,
          role: 'assistant' as const,
          content: '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: true,
        },
      ]

      upsertLocalConversation(chatId, streamedMessages, title)

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          answer += decoder.decode(value, { stream: true })
          streamedMessages = streamedMessages.map((message) =>
            message.id === assistantId ? { ...message, content: answer } : message
          )
          upsertLocalConversation(chatId, streamedMessages, title)
        }
      } else {
        answer = await response.text()
      }

      const finalMessages = streamedMessages.map((message) =>
        message.id === assistantId
          ? { ...message, content: answer.trim(), isStreaming: false }
          : message
      )
      upsertLocalConversation(chatId, finalMessages, title)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          error instanceof Error
            ? error.message
            : 'Unable to connect to Tanzai. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      upsertLocalConversation(chatId, [...nextMessages, assistantMsg], title)
    } finally {
      setIsThinking(false)
      abortRef.current = null
    }
  }

  const handleStop = () => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsThinking(false)
    setMessages((prev) => prev.map((message) => ({ ...message, isStreaming: false })))
  }

  if (loadingHistory) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background px-4">
        <div className="text-center">
          <TanzaiLogo className="mb-4 justify-center" />
          <div className="mx-auto h-2 w-32 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
          </div>
        </div>
      </div>
    )
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
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
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
              {titleFromMessage(activeTitle)}
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
                aria-label="Delete conversation"
                title="Delete conversation"
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
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

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
              {isThinking && !messages.some((message) => message.isStreaming) && (
                <ThinkingIndicator key="thinking" />
              )}
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
            />
          </div>
        </div>
      </div>
    </div>
  )
}
