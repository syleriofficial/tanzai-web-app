'use client'

import { cn } from '@/lib/utils'

interface TanzaiLogoProps {
  size?: number
  className?: string
  showText?: boolean
  textSize?: string
}

export function TanzaiLogo({ size = 28, className, showText = true, textSize = 'text-xl' }: TanzaiLogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="oklch(0.82 0.18 200)" />
            <stop offset="100%" stopColor="oklch(0.62 0.22 230)" />
          </linearGradient>
        </defs>
        {/* Outer ring */}
        <circle cx="16" cy="16" r="14" stroke="url(#logo-grad)" strokeWidth="1.5" opacity="0.3" />
        {/* Inner geometric mark — stylized "T" / spark */}
        <path
          d="M16 4L28 24H4L16 4Z"
          stroke="url(#logo-grad)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="16" cy="16" r="2.5" fill="url(#logo-grad)" />
        <line x1="16" y1="13.5" x2="16" y2="8" stroke="url(#logo-grad)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {showText && (
        <span className={cn('font-semibold tracking-tight text-foreground', textSize)}>
          Tanzai
        </span>
      )}
    </div>
  )
}
