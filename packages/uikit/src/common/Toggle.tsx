'use client'

import React from 'react'
import { Toggle as CossToggle } from '../ui/toggle'
import { cn } from '../lib'

export interface ToggleProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  icon?: React.ReactNode
  label?: string
  size?: 'small' | 'default' | 'large'
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export function Toggle({
  checked = false,
  onCheckedChange,
  icon,
  label,
  disabled = false,
  className,
  style
}: ToggleProps) {
  return (
    <CossToggle
      pressed={checked}
      onPressedChange={onCheckedChange}
      disabled={disabled}
      className={cn(className)}
      style={style}
    >
      {icon && <span>{icon}</span>}
      {label && <span>{label}</span>}
    </CossToggle>
  )
}
