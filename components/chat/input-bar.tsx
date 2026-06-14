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
    <div className="px-4 pb-5 pt-3 sm:px-6">
      {!value && !focused && (
        <div className="mb-3 flex flex-wrap justify-center gap-2.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setValue(s)
                textareaRef.current?.focus()
              }}
              className="rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div
        className={cn(
          'glass relative rounded-3xl border transition-all duration-200',
          focused ? 'border-primary/40' : 'border-border/60'
        )}
      >
        <div className="flex items-center gap-1.5 px-4 pt-3">
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg p-2 text-muted-foreground/45"
            aria-label="File upload placeholder"
            title="File upload placeholder"
          >
            <Paperclip size={17} />
          </button>
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg p-2 text-muted-foreground/45"
            aria-label="Web search placeholder"
            title="Web search placeholder"
          >
            <Globe size={17} />
          </button>
          <button
            type="button"
            disabled={!onToggleMemory}
            onClick={onToggleMemory}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs transition-colors',
              memoryEnabled
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              !onToggleMemory && 'cursor-not-allowed opacity-50'
            )}
            aria-label="Memory placeholder"
            aria-pressed={memoryEnabled}
            title={memoryEnabled ? 'Memory on' : 'Memory off'}
          >
            <Brain size={17} />
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
          className="min-h-[72px] w-full resize-none bg-transparent px-4 pb-3 pt-3 text-base leading-7 text-foreground placeholder:text-muted-foreground/50 focus:outline-none sm:text-lg"
          aria-label="Message input"
        />

        <div className="flex items-center justify-between px-4 pb-3.5">
          <p className="hidden text-xs text-muted-foreground/45 sm:block">
            {value.length > 0 ? `${value.length} chars` : 'Enter to send, Shift+Enter for newline'}
          </p>

          {isStreaming ? (
            <button
              onClick={onStop}
              className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/15 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/25"
              aria-label="Stop generation"
            >
              <Square size={14} />
              Stop
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-2xl transition-all',
                canSend
                  ? 'bg-primary text-primary-foreground hover:opacity-90 glow'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
              aria-label="Send message"
            >
              <ArrowUp size={19} />
            </button>
          )}
        </div>
      </div>

      <p className="mt-2.5 text-center text-xs text-muted-foreground/45">
        Tanzai can make mistakes. Consider verifying important information.
      </p>
    </div>
  )
}
