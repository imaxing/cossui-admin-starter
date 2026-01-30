'use client'

import React from 'react'
import { Badge as CossBadge, badgeVariants } from '../ui/badge'
import { cn } from '../lib'
import type { VariantProps } from '../lib/cva'

/**
 * Badge Props
 */
export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** 圆点颜色(传入颜色值则显示圆点,如 "#ff0000") */
  dot?: string
  /** 是否显示边框 */
  outline?: boolean
}

/**
 * Badge 组件
 *
 * 封装 shadcn Badge,支持状态标记、标签等场景
 *
 * @example
 * ```tsx
 * <Badge variant="default">默认</Badge>
 * <Badge variant="secondary">次要</Badge>
 * <Badge variant="destructive">危险</Badge>
 * <Badge variant="outline">轮廓</Badge>
 * <Badge dot="#ff0000">有圆点</Badge>
 * <Badge outline>带边框</Badge>
 * ```
 */
export function Badge({
  className,
  variant,
  children,
  dot,
  outline,
  ...restProps
}: BadgeProps) {
  // outline 是自定义属性,不应传递到 DOM
  return (
    <CossBadge
      className={cn(outline && 'border-input', className)}
      variant={variant}
      {...restProps}
    >
      {dot && (
        <span
          aria-hidden="true"
          style={{ background: dot }}
          className={cn("size-1.5 rounded-full")}
        />
      )}
      {children}
    </CossBadge>
  )
}
