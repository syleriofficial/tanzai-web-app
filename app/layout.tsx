import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tanzai — AI Workspace',
  description: 'Tanzai is a premium AI workspace for chat, coding, files, research, memory, and productivity.',
  keywords: ['AI assistant', 'chat', 'Tanzai', 'artificial intelligence', 'productivity'],
  authors: [{ name: 'Tanzai' }],
  openGraph: {
    title: 'Tanzai — AI Workspace',
    description: 'Next-generation AI assistant for clarity, speed, and deep understanding.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tanzai — AI Workspace',
    description: 'Next-generation AI assistant for clarity, speed, and deep understanding.',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a12',
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
