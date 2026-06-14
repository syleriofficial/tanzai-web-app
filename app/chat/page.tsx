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
import { ThemeToggle } from '@/components/theme-toggle'
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

type ChatRow = {
  id: string
  title: string
  preview: string | null
  created_at: string
  updated_at: string
}

type MessageRow = {
  id: string
  chat_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

type PinnedChatRow = {
  chat_id: string
}

type UserSettingsRow = {
  memory_enabled?: boolean | null
}

type Conversation = {
  id: string
  pinned?: boolean
  title: string
  preview: string
  date: string
  messages: Message[]
}

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
        pinned: false,
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

function groupNormalizedRows(
  chats: ChatRow[],
  messages: MessageRow[],
  pinnedChatIds: Set<string>
): Conversation[] {
  const grouped = new Map<string, MessageRow[]>()

  messages.forEach((message) => {
    grouped.set(message.chat_id, [...(grouped.get(message.chat_id) || []), message])
  })

  return chats
    .map((chat) => {
      const sorted = [...(grouped.get(chat.id) || [])].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      const last = sorted[sorted.length - 1]

      return {
        id: chat.id,
        pinned: pinnedChatIds.has(chat.id),
        title: titleFromMessage(chat.title || 'New conversation'),
        preview: chat.preview || (last?.content ? titleFromMessage(last.content) : 'No messages yet'),
        date: formatDate(chat.updated_at || chat.created_at),
        updatedAt: chat.updated_at || chat.created_at,
        messages: sorted.map((row) => ({
          id: row.id,
          role: (row.role === 'assistant' ? 'assistant' : 'user') as Message['role'],
          content: row.content,
          timestamp: formatTime(row.created_at),
        })),
      }
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
    .map(({ updatedAt: _updatedAt, ...conversation }) => conversation)
}

export default function ChatPage() {
  const router = useRouter()
  const [supabase] = useState(() => createBrowserClient())
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [memoryEnabled, setMemoryEnabled] = useState(false)
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

  const loadHistory = useCallback(
    async (currentUser: SupabaseUser) => {
      setLoadingHistory(true)
      setError('')

      const [{ data: chats, error: chatsError }, { data: settings }] = await Promise.all([
        supabase
          .from('chats')
          .select('id,title,preview,created_at,updated_at')
          .eq('user_id', currentUser.id)
          .order('updated_at', { ascending: false }),
        supabase
          .from('user_settings')
          .select('memory_enabled')
          .eq('user_id', currentUser.id)
          .maybeSingle(),
      ])

      if (settings) {
        setMemoryEnabled(((settings as UserSettingsRow).memory_enabled ?? false) === true)
      }

      if (!chatsError) {
        const [{ data: normalizedMessages }, { data: pinnedRows }] = await Promise.all([
          supabase
            .from('messages')
            .select('id,chat_id,role,content,created_at')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: true }),
          supabase
            .from('pinned_chats')
            .select('chat_id')
            .eq('user_id', currentUser.id),
        ])

        const pinnedChatIds = new Set(((pinnedRows || []) as PinnedChatRow[]).map((row) => row.chat_id))
        const grouped = groupNormalizedRows(
          (chats || []) as ChatRow[],
          (normalizedMessages || []) as MessageRow[],
          pinnedChatIds
        )
        const next = grouped.length > 0 ? grouped : [createEmptyConversation()]
        setConversations(next)
        setActiveConversationId(next[0].id)
        setMessages(next[0].messages)
        setLoadingHistory(false)
        return
      }

      const { data, error } = await supabase
        .from('chat_history')
        .select('id,user_id,chat_id,role,content,title,created_at')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: true })

      if (error) {
        setError('We could not load your chat history. Start a new chat and try again.')
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
        .from('chats')
        .update({ title: clean, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('id', id)

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

      await supabase.from('chats').delete().eq('user_id', user.id).eq('id', id)
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
    if (!activeConversationId || !user) return

    supabase.from('messages').delete().eq('user_id', user.id).eq('chat_id', activeConversationId)
    supabase.from('chat_history').delete().eq('user_id', user.id).eq('chat_id', activeConversationId)
    supabase
      .from('chats')
      .update({ preview: null, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('id', activeConversationId)

    setMessages([])
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === activeConversationId
          ? { ...conversation, preview: 'No messages yet', messages: [] }
          : conversation
      )
    )
  }, [activeConversationId, supabase, user])

  const handleTogglePinConversation = useCallback(
    async (id: string) => {
      if (!user) return

      const current = conversations.find((conversation) => conversation.id === id)
      const nextPinned = !current?.pinned

      setConversations((prev) =>
        prev
          .map((conversation) =>
            conversation.id === id ? { ...conversation, pinned: nextPinned } : conversation
          )
          .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))
      )

      if (nextPinned) {
        await supabase.from('pinned_chats').upsert({
          chat_id: id,
          user_id: user.id,
        })
      } else {
        await supabase.from('pinned_chats').delete().eq('user_id', user.id).eq('chat_id', id)
      }
    },
    [conversations, supabase, user]
  )

  const handleToggleMemory = useCallback(async () => {
    if (!user) return

    const next = !memoryEnabled
    setMemoryEnabled(next)

    await supabase.from('user_settings').upsert({
      memory_enabled: next,
      updated_at: new Date().toISOString(),
      user_id: user.id,
    })
  }, [memoryEnabled, supabase, user])

  const handleSend = async (
    text: string,
    options?: {
      appendUser?: boolean
      baseMessages?: Message[]
    }
  ) => {
    if (isThinking || !user) return

    const chatId = activeConversationId || crypto.randomUUID()
    const sourceMessages = options?.baseMessages || messages
    const appendUser = options?.appendUser !== false
    const firstUserMessage = sourceMessages.find((message) => message.role === 'user')
    const title = activeConversation?.title && activeConversation.title !== 'New conversation'
      ? activeConversation.title
      : titleFromMessage(firstUserMessage?.content || text)
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    const nextMessages = appendUser ? [...sourceMessages, userMsg] : sourceMessages
    const requestMessages = appendUser ? nextMessages : [...sourceMessages, userMsg]
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
          memory_enabled: memoryEnabled,
          messages: requestMessages.map(
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
        if (response.status === 429) {
          throw new Error('You are sending messages too quickly. Please wait a moment and try again.')
        }
        throw new Error(data?.answer || 'Tanzai is having trouble replying. Please retry in a moment.')
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

      setError(
        error instanceof Error
          ? error.message
          : 'Tanzai could not reply right now. Please check your connection and try again.'
      )
      upsertLocalConversation(chatId, nextMessages, title)
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

  const handleDeleteMessage = useCallback(
    async (messageId: string) => {
      if (!user) return

      const nextMessages = messages.filter((message) => message.id !== messageId)
      setMessages(nextMessages)
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === activeConversationId
            ? {
                ...conversation,
                messages: nextMessages,
                preview: nextMessages.at(-1)?.content
                  ? titleFromMessage(nextMessages.at(-1)!.content)
                  : 'No messages yet',
              }
            : conversation
        )
      )

      await supabase.from('messages').delete().eq('user_id', user.id).eq('id', messageId)
      await supabase.from('chat_history').delete().eq('user_id', user.id).eq('id', messageId)
    },
    [activeConversationId, messages, supabase, user]
  )

  const handleRegenerate = useCallback(
    (messageId: string) => {
      const assistantIndex = messages.findIndex((message) => message.id === messageId)
      if (assistantIndex <= 0) return

      const previousUser = [...messages.slice(0, assistantIndex)]
        .reverse()
        .find((message) => message.role === 'user')
      if (!previousUser) return

      handleDeleteMessage(messageId)
      handleSend(previousUser.content, {
        appendUser: false,
        baseMessages: messages.slice(0, assistantIndex),
      })
    },
    [handleDeleteMessage, messages]
  )

  const handleContinue = useCallback(() => {
    if (messages.length === 0) return

    handleSend('Continue the previous response from where it stopped.', {
      appendUser: false,
      baseMessages: messages,
    })
  }, [messages])

  const handleEditMessage = useCallback(
    async (messageId: string, content: string) => {
      if (!user) return

      const messageIndex = messages.findIndex((message) => message.id === messageId)
      if (messageIndex < 0) return

      const trimmedMessages = messages.slice(0, messageIndex + 1).map((message) =>
        message.id === messageId ? { ...message, content } : message
      )
      const removedMessages = messages.slice(messageIndex + 1)

      setMessages(trimmedMessages)
      upsertLocalConversation(activeConversationId, trimmedMessages)

      await supabase.from('messages').update({ content }).eq('user_id', user.id).eq('id', messageId)
      await supabase.from('chat_history').update({ content }).eq('user_id', user.id).eq('id', messageId)

      for (const message of removedMessages) {
        await supabase.from('messages').delete().eq('user_id', user.id).eq('id', message.id)
        await supabase.from('chat_history').delete().eq('user_id', user.id).eq('id', message.id)
      }

      handleSend(content, {
        appendUser: false,
        baseMessages: trimmedMessages,
      })
    },
    [activeConversationId, messages, supabase, upsertLocalConversation, user]
  )

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
    <div className="flex h-dvh overflow-hidden bg-background">
      <ChatSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations.map(({ id, pinned, title, preview, date }) => ({
          id,
          pinned,
          title,
          preview,
          date,
        }))}
        activeConversationId={activeConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        onTogglePinConversation={handleTogglePinConversation}
      />

      <div className="flex-1 flex flex-col min-w-0 relative bg-[radial-gradient(circle_at_top_right,rgb(37_99_235_/_0.08),transparent_28rem)]">
        <header className="flex h-16 flex-shrink-0 items-center gap-3 border-b border-border/50 bg-background/85 px-4 backdrop-blur-sm sm:h-[72px] sm:px-6">
          <button
            className="rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={sidebarOpen}
          >
            <Menu size={18} />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
              {titleFromMessage(activeTitle)}
            </h1>
            <div className="mt-1 hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
              <ShieldCheck size={13} className="text-primary" />
              Protected workspace
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <button
              onClick={handleNewConversation}
              className="hidden items-center gap-2 rounded-2xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary sm:flex"
            >
              <Plus size={16} />
              New
            </button>
            {messages.length > 0 && (
              <button
                onClick={handleClearConversation}
                className="rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Clear chat"
                title="Clear chat"
              >
              <Trash2 size={18} />
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
          <div className="mx-auto max-w-4xl space-y-7 px-4 py-7 sm:px-6 sm:py-9">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-10 sm:py-16"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/25 bg-accent">
                  <Sparkles size={26} className="text-primary" />
                </div>
                <div className="text-center">
                  <TanzaiLogo size={36} className="mb-5 justify-center" />
                  <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    Ask anything in any language
                  </h2>
                  <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                    Tanzai can help in Hindi, English, Hinglish, and more with clear answers,
                    practical writing, research, coding, and planning.
                  </p>
                </div>
              </motion.div>
            )}

            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onContinue={handleContinue}
                onDelete={handleDeleteMessage}
                onEdit={handleEditMessage}
                onRegenerate={handleRegenerate}
              />
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
          <div className="mx-auto max-w-4xl">
            <ChatInputBar
              onSend={handleSend}
              isStreaming={isThinking}
              onStop={handleStop}
              memoryEnabled={memoryEnabled}
              onToggleMemory={handleToggleMemory}
            />
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-28 left-1/2 z-20 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-destructive/30 bg-card px-4 py-3 text-sm text-destructive shadow-2xl"
              role="alert"
            >
              <div className="flex items-start justify-between gap-3">
                <span>{error}</span>
                <button
                  onClick={() => setError('')}
                  className="rounded-md px-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
