import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import ThemeToggle from '@/app/theme-toggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aletheia - AI Ethics Platform',
  description: 'Explore AI ethics through interactive dilemmas. One dilemma, three philosophical perspectives, your verdict.',
  keywords: 'AI ethics, philosophy, ethical dilemmas, artificial intelligence, moral reasoning',
  authors: [{ name: 'Aletheia Team' }],
  openGraph: {
    title: 'Aletheia - AI Ethics Platform',
    description: 'Explore AI ethics through interactive dilemmas. One dilemma, three philosophical perspectives, your verdict.',
    type: 'website',
    url: 'https://aletheia-ai.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aletheia - AI Ethics Platform',
    description: 'Explore AI ethics through interactive dilemmas. One dilemma, three philosophical perspectives, your verdict.',
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const t = localStorage.getItem('aletheia_theme'); const h = document.documentElement; if (t === 'dark') h.classList.add('dark'); else if (t === 'light') h.classList.remove('dark'); } catch (e) {} })();`,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
          <ThemeToggle />
          {children}
        </div>
      </body>
    </html>
  )
}
