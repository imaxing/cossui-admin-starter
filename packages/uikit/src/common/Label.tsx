'use client'

import React from 'react'
import { Label as CossLabel } from '../ui/label'
import { cn } from '../lib'

/**
 * LabelField Props (保留原名称向后兼容)
 */
export interface LabelFieldProps {
  children: React.ReactNode
  htmlFor?: string
  required?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Label Props
 */
export interface LabelProps extends React.ComponentPropsWithoutRef<
  typeof CossLabel
> {
  required?: boolean
}

/**
 * LabelField 组件 (原名称,向后兼容)
 *
 * 封装 shadcn Label,提供额外功能如必填标记
 */
export function LabelField({
  children,
  htmlFor,
  required = false,
  className,
  style
}: LabelFieldProps) {
  return (
    <CossLabel
      htmlFor={htmlFor}
      className={cn(className)}
      style={style}
    >
      {children}
      {required && <span>*</span>}
    </CossLabel>
  )
}

/**
 * Label 组件 (新名称,推荐使用)
 *
 * @example
 * ```tsx
 * <Label htmlFor="username" required>
 *   用户名
 * </Label>
 * ```
 */
export function Label({
  children,
  required,
  className,
  ...props
}: LabelProps) {
  return (
    <CossLabel className={cn(className)} {...props}>
      {children}
      {required && <span>*</span>}
    </CossLabel>
  )
}
