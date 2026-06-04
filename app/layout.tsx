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
    'Tanzai is a next-generation AI assistant designed for chat, research, coding, writing, reasoning, and productivity.',

  keywords: [
    'Tanzai',
    'AI',
    'AI Assistant',
    'ChatGPT Alternative',
    'Artificial Intelligence',
    'Research',
    'Coding Assistant',
    'Writing Assistant',
  ],

  authors: [{ name: 'Tanzai' }],

  creator: 'Tanzai',

  openGraph: {
    title: 'Tanzai – Think Beyond',
    description:
      'Next-generation AI assistant for chat, coding, research, and productivity.',
    url: 'https://tanzaiai.com',
    siteName: 'Tanzai',
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Tanzai – Think Beyond',
    description:
      'Next-generation AI assistant for chat, coding, research, and productivity.',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
