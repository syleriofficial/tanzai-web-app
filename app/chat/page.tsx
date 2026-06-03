'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'
import { ChatSidebar } from '@/components/chat/sidebar'
import { ChatMessage, ThinkingIndicator, type Message } from '@/components/chat/message'
import { ChatInputBar } from '@/components/chat/input-bar'
import { TanzaiLogo } from '@/components/tanzai-logo'

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [memoryEnabled, setMemoryEnabled] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSend = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsThinking(true)

    setTimeout(() => {
      setIsThinking(false)

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Tanzai AI engine is being connected. Your message was received successfully.',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }

      setMessages((prev) => [...prev, assistantMsg])
    }, 600)
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
            <h1 className="text-sm font-medium text-foreground truncate">
              Tanzai
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent border border-primary/25 flex items-center justify-center text-xs font-semibold text-primary">
              T
            </div>
          </div>
        </header>

        <main
          className="flex-1 overflow-y-auto"
          id="chat-messages"
          aria-live="polite"
          aria-label="Conversation"
        >
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <TanzaiLogo size={36} showText={false} className="justify-center mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  How can Tanzai help you today?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Start a new conversation. No demo messages are loaded.
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
