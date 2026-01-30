'use client'

import React from 'react'
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogPanel
} from '../ui/dialog'
import { Button } from './Button'
import { cn } from '../lib'

export interface DialogBoxProps {
  /** 对话框是否打开 */
  open: boolean
  /** 打开状态变化回调 */
  onOpenChange: (open: boolean) => void
  /** 对话框标题 */
  title: string
  /** 对话框描述（可选） */
  description?: string
  /** 对话框内容 */
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
  /** 对话框宽度 */
  width?: number | string
  /** 自定义底部内容 */
  footer?: React.ReactNode | null
  /** 对话框类名 */
  className?: string
  /** 内容区域类名 */
  contentClassName?: string
}

export function DialogBox({
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
  width,
  footer,
  className,
  contentClassName
}: DialogBoxProps) {
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

  // 默认底部按钮
  const defaultFooter = (
    <>
      {showCancelButton && (
        <Button
          type="default"
          ghost
          size="medium"
          onClick={handleCancel}
          disabled={confirmLoading}
        >
          {cancelText}
        </Button>
      )}
      {showOkButton && (
        <Button
          type="primary"
          size="medium"
          onClick={handleOk}
          loading={confirmLoading}
        >
          {okText}
        </Button>
      )}
    </>
  )
  const resolvedFooter = footer === undefined ? defaultFooter : footer

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup
        className={cn(contentClassName)}
        style={{ maxWidth: width }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <DialogPanel className={cn(className)}>
          {children}
        </DialogPanel>

        {resolvedFooter !== null && (
          <DialogFooter variant="default">{resolvedFooter}</DialogFooter>
        )}
      </DialogPopup>
    </Dialog>
  )
}
