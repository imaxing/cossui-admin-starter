'use client'

import React from 'react'
import {
  DropdownMenu as UIDropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem as UIDropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'

export interface DropdownMenuItem {
  key: string
  label: React.ReactNode
  onClick: () => void
  disabled?: boolean
  selected?: boolean
}

export interface DropdownMenuProps {
  trigger: React.ReactNode
  items: DropdownMenuItem[]
  align?: 'start' | 'center' | 'end'
  className?: string
}

export function DropdownMenu({
  trigger,
  items,
  align = 'end',
  className
}: DropdownMenuProps) {
  return (
    <UIDropdownMenu>
      <DropdownMenuTrigger render={trigger as any} />
      <DropdownMenuContent align={align} className={className}>
        {items.map((item) => (
          <UIDropdownMenuItem
            key={item.key}
            onClick={item.onClick}
            disabled={item.disabled}
          >
            {item.label}
          </UIDropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </UIDropdownMenu>
  )
}
