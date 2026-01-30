'use client'

import React from 'react'
import { Tabs as UITabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { cn } from '../lib'

export interface TabsItem {
  value: string
  label: React.ReactNode
  content: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  value: string
  onChange?: (value: string) => void
  items: TabsItem[]
  className?: string
  listClassName?: string
  /** 启用横向滚动（当 Tab 过多时） */
  scrollable?: boolean
}

export function Tabs({
  value,
  onChange,
  items,
  className,
  listClassName,
  scrollable = false
}: TabsProps) {
  const tabsList = (
    <TabsList
      className={cn(scrollable ? 'inline-flex w-max' : 'w-full', listClassName)}
    >
      {items.map((item) => (
        <TabsTrigger
          key={item.value}
          value={item.value}
          disabled={item.disabled}
        >
          {item.label}
        </TabsTrigger>
      ))}
    </TabsList>
  )

  // Base UI onValueChange 签名: (value: any, eventDetails: object) => void
  const handleValueChange = onChange
    ? (newValue: string) => onChange(newValue)
    : undefined

  return (
    <UITabs value={value} onValueChange={handleValueChange} className={className}>
      <TabsList className={cn(listClassName)}>
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          {item.content}
        </TabsContent>
      ))}
    </UITabs>
  )
}

// 导出原始组件供自定义布局使用（容器 + 子组件）
// 注意：Tabs 容器是 ui 层的，但通过 common 层中转导出
export { Tabs as TabsRoot, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
