'use client'

import React from 'react'
import {
  ScrollArea as CossScrollArea,
  ScrollBar as CossScrollBar
} from '../ui/scroll-area'
import { cn } from '../lib'

/**
 * ScrollArea Props
 */
export interface ScrollAreaProps extends React.ComponentPropsWithoutRef<
  typeof CossScrollArea
> {
  orientation?: 'vertical' | 'horizontal' | 'both'
}

/**
 * ScrollArea 组件
 *
 * 封装 shadcn ScrollArea,提供自定义滚动条
 *
 * @example
 * ```tsx
 * <ScrollArea className="h-72 w-48">
 *   <div>很长的内容...</div>
 * </ScrollArea>
 * ```
 */
export function ScrollArea({
  className,
  children,
  orientation = 'vertical',
  ...props
}: ScrollAreaProps) {
  return (
    <CossScrollArea className={cn(className)} {...props}>
      {children}
      {(orientation === 'vertical' || orientation === 'both') && (
        <CossScrollBar orientation="vertical" />
      )}
      {(orientation === 'horizontal' || orientation === 'both') && (
        <CossScrollBar orientation="horizontal" />
      )}
    </CossScrollArea>
  )
}

// 导出子组件供高级自定义
export const ScrollBar = CossScrollBar
