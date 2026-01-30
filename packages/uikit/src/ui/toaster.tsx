'use client'

import type * as React from 'react'
import { ToastProvider } from './toast'

type ToasterProps = React.ComponentProps<typeof ToastProvider>

export function Toaster({ children, ...props }: ToasterProps) {
  return <ToastProvider {...props}>{children}</ToastProvider>
}
