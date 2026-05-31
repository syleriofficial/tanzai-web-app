'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, ThumbsUp, ThumbsDown, Check, Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  isStreaming?: boolean
}

interface MessageProps {
  message: Message
}

export function ChatMessage({ message }: MessageProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isAssistant = message.role === 'assistant'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('flex gap-3 group', isAssistant ? 'justify-start' : 'justify-end')}
    >
      {/* Avatar — assistant only */}
      {isAssistant && (
        <div className="w-8 h-8 rounded-xl bg-accent border border-primary/25 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles size={14} className="text-primary" />
        </div>
      )}

      <div className={cn('flex flex-col gap-1 max-w-[80%]', !isAssistant && 'items-end')}>
        {/* Bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            isAssistant
              ? 'bg-card border border-border/60 text-foreground rounded-tl-sm'
              : 'bg-primary/15 border border-primary/20 text-foreground rounded-tr-sm'
          )}
        >
          {message.isStreaming ? (
            <span>
              {message.content}
              <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 cursor-blink align-middle" />
            </span>
          ) : (
            <span className="whitespace-pre-wrap">{message.content}</span>
          )}
        </div>

        {/* Timestamp + actions */}
        <div
          className={cn(
            'flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-1',
            isAssistant ? 'flex-row' : 'flex-row-reverse'
          )}
        >
          <span className="text-[10px] text-muted-foreground/50">{message.timestamp}</span>

          {isAssistant && (
            <>
              <button
                onClick={copyToClipboard}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Copy message"
              >
                {copied ? <Check size={11} className="text-primary" /> : <Copy size={11} />}
              </button>
              <button
                onClick={() => setFeedback('up')}
                className={cn(
                  'p-1 rounded-md transition-colors',
                  feedback === 'up'
                    ? 'text-primary bg-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
                aria-label="Thumbs up"
              >
                <ThumbsUp size={11} />
              </button>
              <button
                onClick={() => setFeedback('down')}
                className={cn(
                  'p-1 rounded-md transition-colors',
                  feedback === 'down'
                    ? 'text-destructive bg-destructive/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
                aria-label="Thumbs down"
              >
                <ThumbsDown size={11} />
              </button>
            </>
          )}

          {!isAssistant && (
            <button
              onClick={copyToClipboard}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Copy message"
            >
              {copied ? <Check size={11} className="text-primary" /> : <Copy size={11} />}
            </button>
          )}
        </div>
      </div>

      {/* Avatar — user only */}
      {!isAssistant && (
        <div className="w-8 h-8 rounded-xl bg-accent border border-border/40 flex items-center justify-center flex-shrink-0 mt-0.5">
          <User size={14} className="text-muted-foreground" />
        </div>
      )}
    </motion.div>
  )
}

export function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-xl bg-accent border border-primary/25 flex items-center justify-center flex-shrink-0">
        <Sparkles size={14} className="text-primary" />
      </div>
      <div className="bg-card border border-border/60 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 thinking-dot" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 thinking-dot" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 thinking-dot" />
      </div>
    </motion.div>
  )
}
