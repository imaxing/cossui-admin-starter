'use client'

import React, { useEffect, useState } from 'react'
import {
  Collapsible as CossCollapsible,
  CollapsibleContent as CossCollapsibleContent,
  CollapsibleTrigger as CossCollapsibleTrigger
} from '../ui/collapsible'
import { cn } from '../lib'

/**
 * Collapsible Props
 */
export interface CollapsibleProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  defaultOpen?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * CollapsibleTrigger Props
 */
export interface CollapsibleTriggerProps {
  className?: string
  children: React.ReactNode
}

/**
 * CollapsibleContent Props
 */
export interface CollapsibleContentProps {
  className?: string
  children: React.ReactNode
}

/**
 * Collapsible 组件
 *
 * 折叠面板组件,封装 shadcn Collapsible
 *
 * @example
 * ```tsx
 * <Collapsible open={isOpen} onOpenChange={setIsOpen}>
 *   <CollapsibleTrigger>
 *     <button>展开/收起</button>
 *   </CollapsibleTrigger>
 *   <CollapsibleContent>
 *     <div>折叠内容</div>
 *   </CollapsibleContent>
 * </Collapsible>
 * ```
 */
export function Collapsible({
  open,
  onOpenChange,
  disabled,
  defaultOpen,
  className,
  children
}: CollapsibleProps) {
  const [is_mounted, set_is_mounted] = useState(false)

  useEffect(() => {
    set_is_mounted(true)
  }, [])

  if (!is_mounted) return null

  return (
    <CossCollapsible
      open={open}
      onOpenChange={onOpenChange}
      disabled={disabled}
      defaultOpen={defaultOpen}
      className={cn(className)}
    >
      {children}
    </CossCollapsible>
  )
}

/**
 * CollapsibleTrigger 组件
 */
export function CollapsibleTrigger({
  className,
  children
}: CollapsibleTriggerProps) {
  return (
    <CossCollapsibleTrigger className={cn(className)}>
      {children}
    </CossCollapsibleTrigger>
  )
}

/**
 * CollapsibleContent 组件
 */
export function CollapsibleContent({
  className,
  children
}: CollapsibleContentProps) {
  return (
    <CossCollapsibleContent className={cn(className)}>
      {children}
    </CossCollapsibleContent>
  )
}

/**
 * 复合组件导出
 */
Collapsible.Trigger = CollapsibleTrigger
Collapsible.Content = CollapsibleContent
