'use client'

import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { Button } from './Button'
import { AlertTriangle, Check, Info, X } from 'lucide-react'

// Modal 属性类型
export interface ModalProps {
  open?: boolean
  title?: React.ReactNode
  content?: React.ReactNode
  footer?: React.ReactNode | null
  width?: number | string
  centered?: boolean
  maskClosable?: boolean
  closable?: boolean
  destroyOnClose?: boolean
  className?: string
  style?: React.CSSProperties
  onOk?: () => void | Promise<void>
  onCancel?: () => void
  okText?: string
  cancelText?: string
  okButtonProps?: any
  cancelButtonProps?: any
  confirmLoading?: boolean
  children?: React.ReactNode
}

// Modal 组件（声明式）
export function ModalComponent({
  open = false,
  title,
  content,
  footer,
  width = 520,
  centered = true,
  maskClosable = true,
  closable = true,
  destroyOnClose = false,
  className,
  style,
  onOk,
  onCancel,
  okText = '确定',
  cancelText = '取消',
  okButtonProps,
  cancelButtonProps,
  confirmLoading = false,
  children
}: ModalProps) {
  const [loading, setLoading] = React.useState(false)

  const handleOk = async () => {
    if (onOk) {
      setLoading(true)
      try {
        await onOk()
      } finally {
        setLoading(false)
      }
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && onCancel) {
      onCancel()
    }
  }

  const renderFooter = () => {
    if (footer === null) return null
    if (footer) return footer

    return (
      <DialogFooter>
        <Button {...cancelButtonProps} onClick={onCancel}>
          {cancelText}
        </Button>
        <Button
          type="primary"
          loading={loading || confirmLoading}
          {...okButtonProps}
          onClick={handleOk}
        >
          {okText}
        </Button>
      </DialogFooter>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      disablePointerDismissal={!maskClosable}
    >
      <DialogContent className={className} style={{ width, ...style }}>
        {(title || closable) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
          </DialogHeader>
        )}
        {(content || children) && (
          <DialogDescription>
            {content || children}
          </DialogDescription>
        )}
        {renderFooter()}
      </DialogContent>
    </Dialog>
  )
}

// 确认对话框配置
interface ModalConfirmProps {
  title?: React.ReactNode
  content?: React.ReactNode
  okText?: string
  cancelText?: string
  onOk?: () => void | Promise<void>
  onCancel?: () => void
  type?: 'info' | 'success' | 'warning' | 'error' | 'confirm'
  okButtonProps?: any
  cancelButtonProps?: any
  width?: number
  centered?: boolean
  icon?: React.ReactNode
}

// 命令式调用的内部组件
function ModalConfirmInternal({
  title,
  content,
  okText = '确定',
  cancelText = '取消',
  onOk,
  onCancel,
  type = 'confirm',
  okButtonProps,
  cancelButtonProps,
  width = 416,
  centered = true,
  icon
}: ModalConfirmProps & { onClose: () => void }) {
  const [open, setOpen] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  const handleOk = async () => {
    if (onOk) {
      setLoading(true)
      try {
        await onOk()
        setOpen(false)
      } catch (error) {
        setLoading(false)
        throw error
      }
    } else {
      setOpen(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    setOpen(false)
  }

  const getIcon = () => {
    if (icon) return icon
    const icons = {
      info: <Info />,
      success: <Check />,
      warning: <AlertTriangle />,
      error: <X />,
      confirm: <AlertTriangle />
    }
    return icons[type]
  }

  const getOkButtonType = () => {
    if (type === 'error' || type === 'warning') return 'danger'
    return 'primary'
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent style={{ width }}>
        <DialogHeader>
          <DialogTitle>
            {getIcon()} {title || '提示'}
          </DialogTitle>
        </DialogHeader>
        {content && (
          <DialogDescription>
            {content}
          </DialogDescription>
        )}
        <DialogFooter>
          {type === 'confirm' && (
            <Button {...cancelButtonProps} onClick={handleCancel}>
              {cancelText}
            </Button>
          )}
          <Button
            type={getOkButtonType() as any}
            loading={loading}
            {...okButtonProps}
            onClick={handleOk}
          >
            {okText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 命令式调用方法
function createConfirm(config: ModalConfirmProps) {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)

  const destroy = () => {
    root.unmount()
    if (div.parentNode) {
      div.parentNode.removeChild(div)
    }
  }

  root.render(<ModalConfirmInternal {...config} onClose={destroy} />)

  return {
    destroy
  }
}

// 导出命令式 API
const ModalStaticMethods = {
  confirm: (config: ModalConfirmProps) =>
    createConfirm({ ...config, type: 'confirm' }),
  info: (config: ModalConfirmProps) =>
    createConfirm({ ...config, type: 'info' }),
  success: (config: ModalConfirmProps) =>
    createConfirm({ ...config, type: 'success' }),
  warning: (config: ModalConfirmProps) =>
    createConfirm({ ...config, type: 'warning' }),
  error: (config: ModalConfirmProps) =>
    createConfirm({ ...config, type: 'error' })
}

// 合并组件和静态方法
export const Modal = Object.assign(ModalComponent, ModalStaticMethods)
