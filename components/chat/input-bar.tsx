'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Paperclip, Mic, Image as ImageIcon, ArrowUp,
  Square, Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputBarProps {
  onSend: (message: string) => void
  isStreaming?: boolean
  onStop?: () => void
  memoryEnabled?: boolean
  onToggleMemory?: () => void
}

const suggestions = [
  'Explain this concept simply',
  'Write a Python function for...',
  'Summarize this document',
  'Debug my code',
]

export function ChatInputBar({
  onSend,
  isStreaming,
  onStop,
  memoryEnabled,
  onToggleMemory,
}: InputBarProps) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px'
  }, [value])

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isStreaming) return
    onSend(trimmed)
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = value.trim().length > 0 && !isStreaming

  return (
    <div className="px-3 sm:px-4 pb-4 pt-2">
      {/* Suggestion chips — only when empty & unfocused */}
      {!value && !focused && (
        <div className="flex flex-wrap gap-2 justify-center mb-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setValue(s)
                textareaRef.current?.focus()
              }}
              className="text-xs text-muted-foreground border border-border/60 rounded-full px-3 py-1.5 hover:border-primary/40 hover:text-foreground transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div
        className={cn(
          'relative glass rounded-2xl border transition-all duration-200',
          focused ? 'border-primary/40' : 'border-border/60'
        )}
      >
        {/* Toolbar top */}
        <div className="flex items-center gap-1 px-3 pt-2.5 pb-1">
          <label className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer transition-colors" title="Upload file">
            <Paperclip size={15} />
            <input type="file" className="sr-only" accept=".pdf,.txt,.doc,.docx,.csv,.json" aria-label="Upload file" />
          </label>
          <label className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer transition-colors" title="Upload image">
            <ImageIcon size={15} />
            <input type="file" className="sr-only" accept="image/*" aria-label="Upload image" />
          </label>
          <button
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Voice input"
            aria-label="Voice input"
          >
            <Mic size={15} />
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Memory toggle */}
          <button
            onClick={onToggleMemory}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
              memoryEnabled
                ? 'bg-accent text-primary border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
            title={memoryEnabled ? 'Memory on' : 'Memory off'}
            aria-label="Toggle memory"
          >
            <Brain size={12} />
            <span className="hidden sm:inline">Memory</span>
          </button>
        </div>

        {/* Text input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask Tanzai anything... (Shift+Enter for new line)"
          rows={1}
          className="w-full bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none leading-relaxed min-h-[44px]"
          aria-label="Message input"
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-3 pb-2.5">
          <p className="text-[10px] text-muted-foreground/40 hidden sm:block">
            {value.length > 0 ? `${value.length} chars` : 'Enter to send, Shift+Enter for newline'}
          </p>

          {isStreaming ? (
            <button
              onClick={onStop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-destructive/15 text-destructive border border-destructive/20 hover:bg-destructive/25 transition-colors"
              aria-label="Stop generation"
            >
              <Square size={11} />
              Stop
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                'w-8 h-8 rounded-xl flex items-center justify-center transition-all',
                canSend
                  ? 'bg-primary text-primary-foreground hover:opacity-90 glow'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
              aria-label="Send message"
            >
              <ArrowUp size={15} />
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground/40 mt-2">
        Tanzai can make mistakes. Consider verifying important information.
      </p>
    </div>
  )
}
