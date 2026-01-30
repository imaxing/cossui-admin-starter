'use client'

import '@cat/uikit/globals.css'
import { RootLayout as BaseRootLayout } from '@cat/uikit'

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
