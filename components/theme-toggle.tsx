'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const isLight = resolvedTheme === 'light'

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-2xl border border-border bg-card/80 p-1.5 shadow-sm backdrop-blur-sm',
        className
      )}
      aria-label="Theme"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={cn(
          'flex h-9 items-center gap-2 rounded-xl px-3.5 text-sm font-medium transition-colors',
          isLight
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )}
        aria-pressed={isLight}
      >
        <Sun size={16} />
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={cn(
          'flex h-9 items-center gap-2 rounded-xl px-3.5 text-sm font-medium transition-colors',
          !isLight
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )}
        aria-pressed={!isLight}
      >
        <Moon size={16} />
        Dark
      </button>
    </div>
  )
}
