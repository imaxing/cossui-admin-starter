'use client'

import { useEffect } from 'react'
import { setRequestErrorHandler } from '@koala/shared'
import { toast } from '../lib/toast'
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

  // 注入全局请求错误处理器
  useEffect(() => {
    setRequestErrorHandler((message: string) => {
      toast.error(message)
    })
  }, [])

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
