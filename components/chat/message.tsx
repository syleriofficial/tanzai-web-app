'use client'

import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Pencil, RefreshCw, Sparkles, Trash2, User } from 'lucide-react'
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
  onContinue?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  onEdit?: (messageId: string, content: string) => void
  onRegenerate?: (messageId: string) => void
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="rounded-md border border-border bg-background/80 px-1.5 py-0.5 text-[0.9em] text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      )
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }

    return <span key={index}>{part}</span>
  })
}

function isTableSeparator(line: string) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line)
}

function parseTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())
}

function renderTable(lines: string[], key: string) {
  const [headerLine, , ...bodyLines] = lines
  const headers = parseTableRow(headerLine)
  const rows = bodyLines.map(parseTableRow)

  return (
    <div key={key} className="my-4 max-w-full overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-max border-collapse text-left text-xs sm:text-sm">
        <thead className="bg-background/70 text-foreground">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="border-b border-border px-3 py-2 font-semibold">
                {renderInline(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-background/35">
              {headers.map((_, cellIndex) => (
                <td key={cellIndex} className="border-b border-border/50 px-3 py-2 align-top">
                  {renderInline(row[cellIndex] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="my-3 max-w-full overflow-hidden rounded-xl border border-border bg-background/85">
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-1.5">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {language || 'code'}
        </span>
        <button
          onClick={copyCode}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Copy code"
          title="Copy code"
        >
          {copied ? <Check size={10} className="text-primary" /> : <Copy size={10} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="max-w-full overflow-x-auto p-3 text-xs leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function renderMarkdownBlocks(markdown: string, keyPrefix: string) {
  const lines = markdown.split('\n')
  const blocks: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    if (
      index + 1 < lines.length &&
      line.includes('|') &&
      isTableSeparator(lines[index + 1])
    ) {
      const tableLines = [line, lines[index + 1]]
      index += 2

      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        tableLines.push(lines[index])
        index += 1
      }

      blocks.push(renderTable(tableLines, `${keyPrefix}-table-${index}`))
      continue
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      const level = heading[1].length
      const className =
        level === 1
          ? 'mt-4 mb-2 text-lg font-semibold tracking-tight text-foreground'
          : level === 2
            ? 'mt-4 mb-2 text-base font-semibold text-foreground'
            : 'mt-3 mb-1.5 text-sm font-semibold text-foreground'

      blocks.push(
        <div key={`${keyPrefix}-heading-${index}`} className={className}>
          {renderInline(heading[2])}
        </div>
      )
      index += 1
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = []

      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ''))
        index += 1
      }

      blocks.push(
        <ul key={`${keyPrefix}-ul-${index}`} className="my-3 space-y-1.5 pl-5">
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="list-disc pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      )
      continue
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = []

      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ''))
        index += 1
      }

      blocks.push(
        <ol key={`${keyPrefix}-ol-${index}`} className="my-3 space-y-1.5 pl-5">
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="list-decimal pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      )
      continue
    }

    const paragraph: string[] = []

    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().match(/^(#{1,3})\s+(.+)$/) &&
      !/^[-*]\s+/.test(lines[index].trim()) &&
      !/^\d+\.\s+/.test(lines[index].trim()) &&
      !(index + 1 < lines.length && lines[index].includes('|') && isTableSeparator(lines[index + 1]))
    ) {
      paragraph.push(lines[index])
      index += 1
    }

    blocks.push(
      <p key={`${keyPrefix}-p-${index}`} className="my-2 whitespace-pre-wrap">
        {renderInline(paragraph.join('\n'))}
      </p>
    )
  }

  return blocks
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/```([\s\S]*?)```/g)

  return (
    <div className="min-w-0 max-w-full space-y-1 break-words">
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          const [firstLine, ...rest] = part.replace(/^\n/, '').split('\n')
          const hasLanguage = firstLine && !firstLine.includes(' ') && rest.length > 0
          const language = hasLanguage ? firstLine.trim() : ''
          const code = hasLanguage ? rest.join('\n') : part.trim()

          return <CodeBlock key={index} code={code} language={language} />
        }

        return renderMarkdownBlocks(part, `md-${index}`)
      })}
    </div>
  )
}

export function ChatMessage({
  message,
  onContinue,
  onDelete,
  onEdit,
  onRegenerate,
}: MessageProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const isAssistant = message.role === 'assistant'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('flex gap-3 group', isAssistant ? 'justify-start' : 'justify-end')}
    >
      {isAssistant && (
        <div className="w-8 h-8 rounded-xl bg-accent border border-primary/25 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles size={14} className="text-primary" />
        </div>
      )}

      <div
        className={cn(
          'flex min-w-0 flex-col gap-1',
          isAssistant
            ? 'max-w-[calc(100%-2.75rem)] sm:max-w-[82%]'
            : 'max-w-[86%] sm:max-w-[78%] items-end'
        )}
      >
        <div
          className={cn(
            'min-w-0 max-w-full overflow-hidden rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
            isAssistant
              ? 'bg-card border border-border/60 text-foreground rounded-tl-sm'
              : 'bg-primary text-primary-foreground rounded-tr-sm'
          )}
        >
          {message.isStreaming ? (
            <span className="break-words whitespace-pre-wrap">
              {message.content}
              <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 cursor-blink align-middle" />
            </span>
          ) : (
            <MessageContent content={message.content} />
          )}
        </div>

        <div
          className={cn(
            'flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity duration-200 px-1',
            isAssistant ? 'flex-row' : 'flex-row-reverse'
          )}
        >
          <span className="text-[10px] text-muted-foreground/50">{message.timestamp}</span>

          <button
            onClick={copyToClipboard}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Copy message"
          >
            {copied ? <Check size={11} className="text-primary" /> : <Copy size={11} />}
          </button>

          {isAssistant && onRegenerate && (
            <button
              onClick={() => onRegenerate(message.id)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Regenerate response"
              title="Regenerate response"
            >
              <RefreshCw size={11} />
            </button>
          )}

          {isAssistant && onContinue && (
            <button
              onClick={() => onContinue(message.id)}
              className="rounded-md px-1.5 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Continue response"
              title="Continue response"
            >
              Continue
            </button>
          )}

          {!isAssistant && onEdit && (
            <button
              onClick={() => {
                const next = window.prompt('Edit message', message.content)
                if (next?.trim()) onEdit(message.id, next.trim())
              }}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Edit message"
              title="Edit message"
            >
              <Pencil size={11} />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm('Delete this message?')) onDelete(message.id)
              }}
              className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              aria-label="Delete message"
              title="Delete message"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      </div>

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
