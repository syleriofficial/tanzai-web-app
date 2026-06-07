import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://tanzaiai.com'),

  title: {
    default: 'Tanzai – Think Beyond',
    template: '%s | Tanzai',
  },

  description:
    'Tanzai is a focused AI workspace for clear chat, research, writing, coding support, and practical planning.',

  keywords: [
    'Tanzai',
    'AI',
    'AI Assistant',
    'Artificial Intelligence',
    'AI Workspace',
    'Research',
    'Coding Assistant',
    'Writing Assistant',
  ],

  authors: [{ name: 'Tanzai' }],

  creator: 'Tanzai',

  openGraph: {
    title: 'Tanzai – Think Beyond',
    description:
      'A focused AI workspace for chat, coding support, research, writing, and practical planning.',
    url: 'https://tanzaiai.com',
    siteName: 'Tanzai',
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Tanzai – Think Beyond',
    description:
      'A focused AI workspace for chat, coding support, research, writing, and practical planning.',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0XV20DC2QL"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0XV20DC2QL');
          `}
        </Script>

        {children}
      </body>
    </html>
  )
}
