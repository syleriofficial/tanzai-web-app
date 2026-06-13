'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowUp, Brain, Globe, Paperclip, Square } from 'lucide-react'
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
  'Draft a launch plan',
  'Debug this code',
  'Rewrite this clearly',
]

export function ChatInputBar({
  onSend,
  isStreaming,
  onStop,
  memoryEnabled = true,
  onToggleMemory,
}: InputBarProps) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
        <div className="flex items-center gap-1 px-3 pt-2">
          <button
            type="button"
            disabled
            className="rounded-lg p-1.5 text-muted-foreground/45 cursor-not-allowed"
            aria-label="File upload placeholder"
            title="File upload placeholder"
          >
            <Paperclip size={14} />
          </button>
          <button
            type="button"
            disabled
            className="rounded-lg p-1.5 text-muted-foreground/45 cursor-not-allowed"
            aria-label="Web search placeholder"
            title="Web search placeholder"
          >
            <Globe size={14} />
          </button>
          <button
            type="button"
            disabled={!onToggleMemory}
            onClick={onToggleMemory}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] transition-colors',
              memoryEnabled
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              !onToggleMemory && 'cursor-not-allowed opacity-50'
            )}
            aria-label="Memory placeholder"
            aria-pressed={memoryEnabled}
            title={memoryEnabled ? 'Memory on' : 'Memory off'}
          >
            <Brain size={14} />
            <span className="hidden sm:inline">Memory {memoryEnabled ? 'on' : 'off'}</span>
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={isStreaming ? 'Tanzai is thinking...' : 'Ask anything in any language'}
          rows={1}
          disabled={isStreaming}
          className="w-full bg-transparent px-3 pt-2 pb-2 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none leading-relaxed min-h-[56px]"
          aria-label="Message input"
        />

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
