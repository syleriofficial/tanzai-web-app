import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tanzai – AI Chat',
  description:
    'Chat with Tanzai in Hindi, English, Hinglish, and more. A fast, secure AI workspace for writing, research, coding, and practical planning.',
  alternates: {
    canonical: '/chat',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
