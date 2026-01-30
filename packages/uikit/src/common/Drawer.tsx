'use client'

import React from 'react'
import {
  Drawer as UIDrawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose
} from '../ui/drawer'
import { Button } from './Button'
import { cn } from '../lib'
import { X } from 'lucide-react'
import { useEscapeKey } from '../hooks/use-keyboard'

export interface DrawerProps {
  /** Drawer 是否打开 */
  open: boolean
  /** 打开状态变化回调 */
  onOpenChange: (open: boolean) => void
  /** Drawer 标题（可选，不传则不显示 header） */
  title?: string
  /** Drawer 描述（可选） */
  description?: string
  /** Drawer 内容 */
  children: React.ReactNode
  /** 确认按钮文本 */
  okText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 确认按钮点击回调 */
  onOk?: () => void | Promise<void>
  /** 取消按钮点击回调 */
  onCancel?: () => void
  /** 是否显示确认按钮 */
  showOkButton?: boolean
  /** 是否显示取消按钮 */
  showCancelButton?: boolean
  /** 确认按钮加载状态 */
  confirmLoading?: boolean
  /** 方向 */
  direction?: 'top' | 'bottom' | 'left' | 'right'
  /** 自定义底部内容 */
  footer?: React.ReactNode | null
  /** Drawer 类名 */
  className?: string
  /** 内容区域类名 */
  contentClassName?: string
  /** 是否可关闭（显示右上角关闭按钮） */
  closable?: boolean
  /** 是否可以通过点击遮罩关闭 */
  dismissible?: boolean
  /** 高度（仅在 direction 为 top/bottom 时生效，如 '90vh' '80%' 等） */
  height?: string
  /** 当 closable 为 false 时用户尝试关闭的回调 */
  onCloseAttempt?: () => void
}

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  okText = '确定',
  cancelText = '取消',
  onOk,
  onCancel,
  showOkButton = true,
  showCancelButton = true,
  confirmLoading = false,
  direction = 'bottom',
  footer,
  className,
  contentClassName,
  closable = true,
  dismissible = true,
  height,
  onCloseAttempt
}: DrawerProps) {
  const handleOk = async () => {
    if (onOk) {
      await onOk()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      onOpenChange(false)
    }
  }

  const handleClose = () => {
    if (onCancel) {
      onCancel()
    } else {
      onOpenChange(false)
    }
  }

  const handleUserCloseAttempt = () => {
    if (!closable && onCloseAttempt) {
      onCloseAttempt()
    } else if (closable) {
      handleClose()
    }
  }

  useEscapeKey(() => {
    handleUserCloseAttempt()
  }, open)

  // 默认底部按钮
  const defaultFooter = (
    <>
      {showCancelButton && (
        <Button type="default" onClick={handleCancel} disabled={confirmLoading}>
          {cancelText}
        </Button>
      )}
      {showOkButton && (
        <Button type="primary" onClick={handleOk} loading={confirmLoading}>
          {okText}
        </Button>
      )}
    </>
  )

  const hasHeader = !!title
  const hasFooter = footer !== null

  // 计算内容区域高度（减去 header 和 footer）
  const contentHeight = React.useMemo(() => {
    if (!height || (direction !== 'top' && direction !== 'bottom')) {
      return undefined
    }

    const parts = [height]
    if (hasHeader) parts.push('80px') // header 约 80px
    if (hasFooter) parts.push('72px') // footer 约 72px

    if (parts.length === 1) return height
    return `calc(${parts[0]} - ${parts.slice(1).join(' - ')})`
  }, [height, direction, hasHeader, hasFooter])

  return (
    <UIDrawer
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          handleUserCloseAttempt()
        }
      }}
      direction={direction}
      dismissible={dismissible}
    >
      <DrawerContent
        className={cn(
          'bg-primary text-popover-foreground shadow-xl border border-border',
          contentClassName
        )}
        style={
          height && (direction === 'top' || direction === 'bottom')
            ? { maxHeight: height }
            : undefined
        }
      >
        {/* Header - 固定高度（仅在有 title 时渲染） */}
        {title && (
          <DrawerHeader>
            {closable && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleUserCloseAttempt()
                }}
              >
                <X />
                <span className="sr-only">关闭</span>
              </button>
            )}
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
        )}

        {/* Content - 用 calc 精确高度，内部可用 h-full */}
        <div
          className={cn(className)}
          style={contentHeight ? { height: contentHeight } : undefined}
        >
          {children}
        </div>

        {/* Footer - 固定高度 */}
        {footer !== null && (
          <DrawerFooter>
            {footer === undefined ? defaultFooter : footer}
          </DrawerFooter>
        )}
      </DrawerContent>
    </UIDrawer>
  )
}
