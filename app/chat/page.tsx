use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Sparkles, ShieldCheck, WifiOff } from 'lucide-react'
import { ChatSidebar } from '@/components/chat/sidebar'
import { ChatMessage, ThinkingIndicator, type Message } from '@/components/chat/message'
import { ChatInputBar } from '@/components/chat/input-bar'
import { TanzaiLogo } from '@/components/tanzai-logo'

const welcomeMessage: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Welcome to Tanzai. Ask anything, upload context, or start a deep work session. I will keep answers clear, useful, and focused.',
  timestamp: 'Now',
}

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([welcomeMessage])
  const [isStreaming, setIsStreaming] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [memoryEnabled, setMemoryEnabled] = useState(true)
  const [networkError, setNetworkError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSend = async (text: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: now(),
    }

    const assistantId = crypto.randomUUID()
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: now(),
      isStreaming: true,
    }

    setMessages((prev) => [...prev, userMsg])
    setNetworkError(null)
    setIsThinking(true)
    setIsStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          memoryEnabled,
          messages: [...messages.filter((m) => m.id !== 'welcome'), userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      setIsThinking(false)
      setMessages((prev) => [...prev, assistantMsg])

      if (!response.ok) {
        const detail = await response.text()
        throw new Error(detail || 'Syleri Engine request failed')
      }

      const contentType = response.headers.get('content-type') || ''

      if (response.body && contentType.includes('text/event-stream')) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let full = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          full += chunk
          setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: full } : m))
        }
      } else {
        const data = await response.json()
        const answer = data.answer || data.message || data.content || 'Tanzai could not generate a response.'
        setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: answer } : m))
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        const msg = 'Syleri Engine is not connected yet. Check NEXT_PUBLIC_SYLERI_ENGINE_URL and SYLERI_ENGINE_SECRET.'
        setNetworkError(msg)
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: msg,
            timestamp: now(),
          },
        ])
      }
    } finally {
      setIsThinking(false)
      setIsStreaming(false)
      abortRef.current = null
      setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, isStreaming: false } : m))
    }
  }

  const handleStop = () => {
    abortRef.current?.abort()
    setIsStreaming(false)
    setIsThinking(false)
    setMessages((prev) => prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)))
  }

  const title = messages.findLast((m) => m.role === 'user')?.content || 'New conversation'

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ChatSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="flex items-center gap-3 px-4 h-14 border-b border-border/50 flex-shrink-0 bg-background/80 backdrop-blur-sm">
          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-medium text-foreground truncate">{title}</h1>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] text-primary">
            <ShieldCheck size={13} />
            Syleri Engine
          </div>

          <div className="w-8 h-8 rounded-full bg-accent border border-primary/25 flex items-center justify-center text-xs font-semibold text-primary">T</div>
        </header>

        {networkError && (
          <div className="mx-auto mt-3 flex max-w-3xl items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <WifiOff size={14} /> {networkError}
          </div>
        )}

        <main className="flex-1 overflow-y-auto" id="chat-messages" aria-live="polite" aria-label="Conversation">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.length === 1 && messages[0].id === 'welcome' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                <TanzaiLogo size={42} showText={false} className="justify-center mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">What should Tanzai help you build today?</h2>
                <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                  Chat, code, analyze files, write, plan, research, and create with one clean AI workspace.
                </p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {['Create a launch plan', 'Explain this code', 'Write better copy', 'Analyze a document'].map((item) => (
                    <button key={item} onClick={() => handleSend(item)} className="rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-left text-sm hover:border-primary/35 hover:bg-accent transition-all">
                      <Sparkles size={14} className="mb-2 text-primary" />{item}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((message) => <ChatMessage key={message.id} message={message} />)}

            <AnimatePresence>{isThinking && <ThinkingIndicator key="thinking" />}</AnimatePresence>
            <div ref={bottomRef} />
          </div>
        </main>

        <div className="flex-shrink-0 bg-background/80 backdrop-blur-sm border-t border-border/30">
          <div className="max-w-3xl mx-auto">
            <ChatInputBar onSend={handleSend} isStreaming={isStreaming} onStop={handleStop} memoryEnabled={memoryEnabled} onToggleMemory={() => setMemoryEnabled(!memoryEnabled)} />
          </div>
        </div>
      </div>
    </div>
  )
}
