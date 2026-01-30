'use client'

import * as React from 'react'

import { cn } from '../lib'
import {
  Sheet,
  SheetBackdrop,
  SheetClose,
  SheetHeader,
  SheetFooter,
  SheetPortal,
  SheetPopup,
  SheetTitle,
  SheetDescription,
  SheetTrigger
} from './sheet'

type DrawerDirection = 'top' | 'bottom' | 'left' | 'right'

type DrawerContextValue = {
  direction: DrawerDirection
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null)

function useDrawerContext() {
  const context = React.useContext(DrawerContext)
  if (!context) {
    throw new Error('Drawer components must be used within <Drawer>.')
  }
  return context
}

type DrawerProps = React.ComponentProps<typeof Sheet> & {
  direction?: DrawerDirection
  dismissible?: boolean
}

function Drawer({
  direction = 'bottom',
  dismissible = true,
  ...props
}: DrawerProps) {
  return (
    <DrawerContext.Provider value={{ direction }}>
      <Sheet disablePointerDismissal={!dismissible} {...props} />
    </DrawerContext.Provider>
  )
}

function DrawerTrigger(props: React.ComponentProps<typeof SheetTrigger>) {
  return <SheetTrigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal(props: React.ComponentProps<typeof SheetPortal>) {
  return <SheetPortal data-slot="drawer-portal" {...props} />
}

function DrawerClose(props: React.ComponentProps<typeof SheetClose>) {
  return <SheetClose data-slot="drawer-close" {...props} />
}

function DrawerOverlay(props: React.ComponentProps<typeof SheetBackdrop>) {
  return <SheetBackdrop data-slot="drawer-overlay" {...props} />
}

type DrawerContentProps = React.ComponentProps<typeof SheetPopup> & {
  direction?: DrawerDirection
  showCloseButton?: boolean
}

function DrawerContent({
  className,
  direction,
  showCloseButton = false,
  ...props
}: DrawerContentProps) {
  const context = useDrawerContext()
  const resolvedDirection = direction || context.direction

  return (
    <SheetPopup
      className={cn(className)}
      data-slot="drawer-content"
      showCloseButton={showCloseButton}
      side={resolvedDirection}
      {...props}
    />
  )
}

function DrawerHeader(props: React.ComponentProps<typeof SheetHeader>) {
  return <SheetHeader data-slot="drawer-header" {...props} />
}

function DrawerFooter(props: React.ComponentProps<typeof SheetFooter>) {
  return <SheetFooter data-slot="drawer-footer" {...props} />
}

function DrawerTitle(props: React.ComponentProps<typeof SheetTitle>) {
  return <SheetTitle data-slot="drawer-title" {...props} />
}

function DrawerDescription(props: React.ComponentProps<typeof SheetDescription>) {
  return <SheetDescription data-slot="drawer-description" {...props} />
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription
}
