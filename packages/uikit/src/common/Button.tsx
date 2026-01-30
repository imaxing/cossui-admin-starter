'use client'

import React from 'react'
import { Button as CossButton } from '../ui/button'
import { Group } from '../ui/group'
import { Spinner } from '../ui/spinner'
import { cn } from '../lib'

// Button 类型定义
export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'onClick' | 'disabled'
> {
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link' | 'danger'
  size?: 'small' | 'medium' | 'large'
  htmlType?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  danger?: boolean
  ghost?: boolean
  icon?: React.ReactNode
  shape?: 'default' | 'circle' | 'round'
  className?: string
  style?: React.CSSProperties
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children?: React.ReactNode
}

export function Button({
  type = 'default',
  size = 'medium',
  htmlType = 'button',
  disabled = false,
  loading = false,
  danger = false,
  ghost = false,
  icon,
  className,
  style,
  onClick,
  children,
  ...rest
}: ButtonProps) {
  // 映射 type 到 shadcn variant
  const getVariant = () => {
    if (ghost) return 'ghost'
    if (danger) return 'destructive'
    if (type === 'primary') return 'default'
    if (type === 'default') return 'default'
    if (type === 'dashed') return 'outline'
    if (type === 'text' || type === 'link') return 'ghost'
    return 'default'
  }

  // 映射 size
  const getCossSize = () => {
    if (size === 'small') return 'sm'
    if (size === 'large') return 'lg'
    return 'default'
  }

  return (
    <CossButton
      type={htmlType}
      variant={getVariant()}
      size={getCossSize()}
      disabled={disabled || loading}
      {...rest}
      className={cn(className)}
      style={style}
      onClick={onClick}
    >
      {loading && <Spinner />}
      {!loading && icon && icon}
      {children}
    </CossButton>
  )
}

// 按钮组
export interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function ButtonGroup({
  children,
  className,
  style
}: ButtonGroupProps) {
  return (
    <Group className={cn(className)} style={style} role="group">
      {children}
    </Group>
  )
}
