'use client'

import '@koala/uikit/globals.css'
import { RootLayout as BaseRootLayout } from '@koala/uikit'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <BaseRootLayout lang="zh" title="Admin Starter">
      {children}
    </BaseRootLayout>
  )
}
