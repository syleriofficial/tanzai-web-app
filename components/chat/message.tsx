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
      <table className="w-full min-w-max border-collapse text-left text-sm sm:text-base">
        <thead className="bg-background/70 text-foreground">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="border-b border-border px-4 py-3 font-semibold">
                {renderInline(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-background/35">
              {headers.map((_, cellIndex) => (
                <td key={cellIndex} className="border-b border-border/50 px-4 py-3 align-top">
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
    <div className="my-4 max-w-full overflow-hidden rounded-2xl border border-border bg-background/85">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {language || 'code'}
        </span>
        <button
          onClick={copyCode}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Copy code"
          title="Copy code"
        >
          {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="max-w-full overflow-x-auto p-4 text-sm leading-relaxed text-foreground">
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
          ? 'mb-3 mt-5 text-2xl font-semibold tracking-tight text-foreground'
          : level === 2
            ? 'mb-3 mt-5 text-xl font-semibold text-foreground'
            : 'mb-2 mt-4 text-lg font-semibold text-foreground'

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
        <ul key={`${keyPrefix}-ul-${index}`} className="my-3 space-y-2 pl-6">
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
        <ol key={`${keyPrefix}-ol-${index}`} className="my-3 space-y-2 pl-6">
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
      <p key={`${keyPrefix}-p-${index}`} className="my-2.5 whitespace-pre-wrap">
        {renderInline(paragraph.join('\n'))}
      </p>
    )
  }

  return blocks
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/```([\s\S]*?)```/g)

  return (
    <div className="min-w-0 max-w-full space-y-1.5 break-words">
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
      className={cn('group flex gap-3.5 sm:gap-4', isAssistant ? 'justify-start' : 'justify-end')}
    >
      {isAssistant && (
        <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-accent">
          <Sparkles size={18} className="text-primary" />
        </div>
      )}

      <div
        className={cn(
          'flex min-w-0 flex-col gap-1',
          isAssistant
            ? 'max-w-[calc(100%-3.5rem)] sm:max-w-[86%]'
            : 'max-w-[88%] items-end sm:max-w-[80%]'
        )}
      >
        <div
          className={cn(
            'min-w-0 max-w-full overflow-hidden rounded-3xl px-4 py-3.5 text-base leading-7 shadow-sm sm:px-5 sm:py-4',
            isAssistant
              ? 'rounded-tl-sm border border-border/60 bg-card text-foreground'
              : 'rounded-tr-sm bg-primary text-primary-foreground'
          )}
        >
          {message.isStreaming ? (
            <span className="break-words whitespace-pre-wrap">
              {message.content}
              <span className="ml-0.5 inline-block h-5 w-0.5 cursor-blink bg-primary align-middle" />
            </span>
          ) : (
            <MessageContent content={message.content} />
          )}
        </div>

        <div
          className={cn(
            'flex items-center gap-2 px-1 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100',
            isAssistant ? 'flex-row' : 'flex-row-reverse'
          )}
        >
          <span className="text-xs text-muted-foreground/50">{message.timestamp}</span>

          <button
            onClick={copyToClipboard}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Copy message"
          >
            {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
          </button>

          {isAssistant && onRegenerate && (
            <button
              onClick={() => onRegenerate(message.id)}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Regenerate response"
              title="Regenerate response"
            >
              <RefreshCw size={14} />
            </button>
          )}

          {isAssistant && onContinue && (
            <button
              onClick={() => onContinue(message.id)}
              className="rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Edit message"
              title="Edit message"
            >
              <Pencil size={14} />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm('Delete this message?')) onDelete(message.id)
              }}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Delete message"
              title="Delete message"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {!isAssistant && (
        <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-border/40 bg-accent">
          <User size={18} className="text-muted-foreground" />
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
      className="flex gap-4"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-accent">
        <Sparkles size={18} className="text-primary" />
      </div>
      <div className="flex items-center gap-2 rounded-3xl rounded-tl-sm border border-border/60 bg-card px-5 py-4">
        <div className="thinking-dot h-2 w-2 rounded-full bg-primary/60" />
        <div className="thinking-dot h-2 w-2 rounded-full bg-primary/60" />
        <div className="thinking-dot h-2 w-2 rounded-full bg-primary/60" />
      </div>
    </motion.div>
  )
}
