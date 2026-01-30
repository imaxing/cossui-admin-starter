'use client'

import { Badge } from '../ui/badge'
import { cn } from '../lib'

// 预定义的颜色变体
export type StatusVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default'
  | 'secondary'
  | 'purple'
  | 'blue'
  | 'gray'

// StatusBadge 组件属性
export interface StatusBadgeProps {
  /** 显示的文本 */
  text: string
  /** 颜色变体 */
  variant?: StatusVariant
  /** 自定义类名 */
  className?: string
  /** 自定义颜色配置 */
  customColor?: {
    bg: string
    text: string
    darkBg?: string
    darkText?: string
  }
}

/**
 * StatusBadge - 通用状态徽章组件
 *
 * @example
 * // 使用预定义变体
 * <StatusBadge text="激活" variant="success" />
 * <StatusBadge text="禁用" variant="error" />
 *
 * // 使用自定义颜色
 * <StatusBadge
 *   text="自定义"
 *   customColor={{
 *     bg: "bg-orange-100",
 *     text: "text-orange-800",
 *     darkBg: "dark:bg-orange-900/30",
 *     darkText: "dark:text-orange-400"
 *   }}
 * />
 */
export function StatusBadge({
  text,
  variant = 'default',
  className
}: StatusBadgeProps) {
  const baseVariants: StatusVariant[] = [
    'success',
    'warning',
    'error',
    'info',
    'secondary'
  ]

  // 自定义 variant 的内联样式映射
  const customVariantStyles: Record<string, React.CSSProperties> = {
    gray: {
      backgroundColor: 'rgb(243 244 246)',
      color: 'rgb(31 41 55)',
    },
    purple: {
      backgroundColor: 'rgb(243 232 255)',
      color: 'rgb(107 33 168)',
    },
    blue: {
      backgroundColor: 'rgb(219 234 254)',
      color: 'rgb(30 64 175)',
    }
  }

  // 如果是自定义 variant，使用内联样式
  if (variant in customVariantStyles) {
    return (
      <Badge
        className={cn('border-transparent', className)}
        style={customVariantStyles[variant]}
      >
        {text}
      </Badge>
    )
  }

  // 标准 variant
  const badgeVariant = baseVariants.includes(variant)
    ? (variant as 'success' | 'warning' | 'error' | 'info' | 'secondary')
    : 'secondary'

  return (
    <Badge variant={badgeVariant} className={cn(className)}>
      {text}
    </Badge>
  )
}
