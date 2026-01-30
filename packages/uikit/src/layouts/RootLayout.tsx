'use client'

import { useEffect } from 'react'
import { Toaster } from '../common/Toaster'
import { Providers } from '../theme/Providers'

interface RootLayoutProps {
  children: React.ReactNode
  lang?: string
  title?: string
}

export function RootLayout({ children, lang = 'en', title }: RootLayoutProps) {
  useEffect(() => {
    if (title) {
      document.title = title
    }
  }, [title])

  return (
    <html lang={lang} suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
