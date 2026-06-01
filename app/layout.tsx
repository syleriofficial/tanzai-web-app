import Script from "next/script";
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tanzai — Think Beyond',
  description: 'Tanzai is a next-generation AI assistant designed for clarity, speed, and deep understanding. Chat, analyze, create, and explore with one intelligent interface.',
  keywords: ['AI assistant', 'chat', 'Tanzai', 'artificial intelligence', 'productivity'],
  authors: [{ name: 'Tanzai' }],
  openGraph: {
    title: 'Tanzai — Think Beyond',
    description: 'Next-generation AI assistant for clarity, speed, and deep understanding.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tanzai — Think Beyond',
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
