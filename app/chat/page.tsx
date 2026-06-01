'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Sparkles } from 'lucide-react'
import { ChatSidebar } from '@/components/chat/sidebar'
import { ChatMessage, ThinkingIndicator, type Message } from '@/components/chat/message'
import { ChatInputBar } from '@/components/chat/input-bar'
import { TanzaiLogo } from '@/components/tanzai-logo'

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm Tanzai. I'm here to help you think through anything — from complex research to quick questions. What's on your mind today?",
    timestamp: '2:14 PM',
  },
  {
    id: '2',
    role: 'user',
    content: 'Explain quantum entanglement in simple terms',
    timestamp: '2:15 PM',
  },
  {
    id: '3',
    role: 'assistant',
    content: "Imagine you have two coins that are magically linked. No matter how far apart they are — across the room or across galaxies — the moment you flip one, the other **instantly** shows the opposite side.\n\nThat instant connection, defying any distance, is quantum entanglement. In physics, it means two particles can be correlated such that measuring one immediately tells you the state of the other, regardless of the space between them.\n\nEinstein famously called it \"spooky action at a distance\" — and he didn't like it one bit. But experiments have confirmed it's real.",
    timestamp: '2:15 PM',
  },
]

const MOCK_RESPONSES = [
  "That's a fascinating question. Let me break this down clearly for you.\n\nThe core idea here involves several interconnected concepts that build on each other. First, we need to establish the foundational principles, then examine how they interact in practice.\n\nHere's what the research tells us...",
  "Great question! Based on current understanding, there are a few key points to consider:\n\n1. **Context matters** — the answer depends significantly on the specific scenario\n2. **Multiple approaches** exist, each with distinct trade-offs\n3. **Best practices** suggest starting with the simplest solution\n\nWould you like me to dive deeper into any of these?",
  "Absolutely. Let me give you a precise and actionable answer.\n\nThe short answer is: it depends on your specific use case. The longer answer involves understanding the trade-offs between performance, maintainability, and scalability.\n\nHere's how I'd recommend thinking through this...",
]

let responseIdx = 0

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [memoryEnabled, setMemoryEnabled] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSend = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsThinking(true)

    // Simulate streaming response
    setTimeout(() => {
      setIsThinking(false)
      const response = MOCK_RESPONSES[responseIdx % MOCK_RESPONSES.length]
      responseIdx++

      const assistantId = (Date.now() + 1).toString()
      const assistantMsg: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true,
      }

      setMessages((prev) => [...prev, assistantMsg])
      setIsStreaming(true)

      // Stream characters
      let charIdx = 0
      const interval = setInterval(() => {
        charIdx += 3
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: response.slice(0, charIdx), isStreaming: charIdx < response.length }
              : m
          )
        )
        if (charIdx >= response.length) {
          clearInterval(interval)
          setIsStreaming(false)
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, isStreaming: false } : m
            )
          )
        }
      }, 20)
    }, 900)
  }

  const handleStop = () => {
    setIsStreaming(false)
    setIsThinking(false)
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ChatSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 h-14 border-b border-border/50 flex-shrink-0 bg-background/80 backdrop-blur-sm">
          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-medium text-foreground truncate">
              Quantum entanglement explained
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent border border-primary/25 flex items-center justify-center text-xs font-semibold text-primary">
              A
            </div>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto" id="chat-messages" aria-live="polite" aria-label="Conversation">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.length === 1 && messages[0].role === 'assistant' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <TanzaiLogo size={36} showText={false} className="justify-center mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">How can I help you today?</h2>
                <p className="text-sm text-muted-foreground">
                  Ask me anything — research, code, analysis, writing, or just a conversation.
                </p>
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

        {/* Input bar */}
        <div className="flex-shrink-0 bg-background/80 backdrop-blur-sm border-t border-border/30">
          <div className="max-w-3xl mx-auto">
            <ChatInputBar
              onSend={handleSend}
              isStreaming={isStreaming}
              onStop={handleStop}
              memoryEnabled={memoryEnabled}
              onToggleMemory={() => setMemoryEnabled(!memoryEnabled)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
