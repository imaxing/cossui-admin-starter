'use client'

import React from 'react'
import {
  Popover as UIPopover,
  PopoverContent,
  PopoverTrigger
} from '../ui/popover'

export interface PopoverProps {
  trigger: React.ReactNode
  content: React.ReactNode
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  className?: string
}

export function Popover({
  trigger,
  content,
  align = 'end',
  sideOffset = 8,
  className
}: PopoverProps) {
  return (
    <UIPopover>
      <PopoverTrigger render={trigger as any} />
      <PopoverContent
        align={align}
        sideOffset={sideOffset}
        className={className}
      >
        {content}
      </PopoverContent>
    </UIPopover>
  )
}

// 导出原始组件供自定义布局使用
// PopoverRoot 是容器，PopoverTrigger/PopoverContent 是子组件
export { Popover as PopoverRoot, PopoverTrigger, PopoverContent } from '../ui/popover'
