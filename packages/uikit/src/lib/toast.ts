import type * as React from 'react'
import type { ToastManagerAddOptions } from '@base-ui/react/toast'

import { toastManager } from '../ui/toast'

type MessageInput =
  | string
  | {
      title?: string
      content?: string
      duration?: number
    }

type ConfirmInput =
  | string
  | {
      title?: string
      content?: string
      okText?: string
      cancelText?: string
      onOk?: () => void | Promise<void>
      onCancel?: () => void | Promise<void>
    }

type ToastActionProps = React.ComponentPropsWithoutRef<'button'>

type ToastActionData = {
  cancelActionProps?: ToastActionProps
}

const activeToastIds = new Set<string>()

function normalizeMessage(input: MessageInput) {
  if (typeof input === 'string') {
    return { title: input, content: undefined, duration: undefined }
  }
  const title = input.title || input.content || ''
  const content =
    input.content && input.content !== input.title ? input.content : undefined
  return {
    title,
    content,
    duration: input.duration
  }
}

function normalizeConfirm(input: ConfirmInput) {
  if (typeof input === 'string') {
    return {
      title: input,
      content: undefined,
      okText: undefined,
      cancelText: undefined,
      onOk: undefined,
      onCancel: undefined
    }
  }
  return {
    title: input.title || input.content || '',
    content: input.content && input.content !== input.title ? input.content : undefined,
    okText: input.okText,
    cancelText: input.cancelText,
    onOk: input.onOk,
    onCancel: input.onCancel
  }
}

function addToast(options: ToastManagerAddOptions<ToastActionData>) {
  let toastId = ''
  const { onClose, ...rest } = options
  const handleClose = () => {
    if (toastId) {
      activeToastIds.delete(toastId)
    }
    onClose?.()
  }

  toastId = toastManager.add<ToastActionData>({
    ...rest,
    onClose: handleClose
  })
  activeToastIds.add(toastId)
  return toastId
}

function createToastOptions(
  normalized: { title: string; content?: string; duration?: number },
  options: { type?: string; duration?: number }
): ToastManagerAddOptions<ToastActionData> {
  const timeout =
    options.duration !== undefined ? options.duration : normalized.duration

  return {
    title: normalized.title,
    description: normalized.content,
    timeout: timeout !== undefined ? timeout : 3000,
    type: options.type
  }
}

function getToastId(value?: string | number) {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return undefined
}

/**
 * Toast 通知工具函数
 * 基于 Base UI toast manager，提供统一的通知接口
 */
export const toast = {
  /**
   * 成功提示
   */
  success: (input: MessageInput, description?: string) => {
    const normalized = normalizeMessage(input)
    const options = createToastOptions(normalized, {
      type: 'success',
      duration: normalized.duration !== undefined ? normalized.duration : 3000
    })

    if (description) {
      options.description = description
    }

    return addToast(options)
  },

  /**
   * 错误提示
   */
  error: (input: MessageInput, description?: string) => {
    const normalized = normalizeMessage(input)
    const options = createToastOptions(normalized, {
      type: 'error',
      duration: normalized.duration !== undefined ? normalized.duration : 4000
    })

    if (description) {
      options.description = description
    }

    return addToast(options)
  },

  /**
   * 警告提示
   */
  warning: (input: MessageInput, description?: string) => {
    const normalized = normalizeMessage(input)
    const options = createToastOptions(normalized, {
      type: 'warning',
      duration: normalized.duration !== undefined ? normalized.duration : 3000
    })

    if (description) {
      options.description = description
    }

    return addToast(options)
  },

  /**
   * 信息提示
   */
  info: (input: MessageInput, description?: string) => {
    const normalized = normalizeMessage(input)
    const options = createToastOptions(normalized, {
      type: 'info',
      duration: normalized.duration !== undefined ? normalized.duration : 3000
    })

    if (description) {
      options.description = description
    }

    return addToast(options)
  },

  /**
   * 加载提示
   */
  loading: (input: MessageInput) => {
    const normalized = normalizeMessage(input)
    const options = createToastOptions(normalized, { type: 'loading' })
    options.timeout = 0

    return addToast(options)
  },

  /**
   * 自定义提示
   */
  message: (input: MessageInput, description?: string) => {
    const normalized = normalizeMessage(input)
    const options = createToastOptions(normalized, {
      duration: normalized.duration !== undefined ? normalized.duration : 3000
    })

    if (description) {
      options.description = description
    }

    return addToast(options)
  },

  /**
   * 确认对话框
   * 返回 Promise<boolean>，用户点击确认返回 true，取消返回 false
   */
  confirm: (input: ConfirmInput): Promise<boolean> => {
    return new Promise((resolve) => {
      const normalized = normalizeConfirm(input)
      let resolved = false
      let toastId = ''

      const resolveOnce = (value: boolean) => {
        if (resolved) return
        resolved = true
        resolve(value)
      }

      const actionProps: ToastActionProps = {
        children: normalized.okText || '确认',
        onClick: async () => {
          await normalized.onOk?.()
          resolveOnce(true)
          toastManager.close(toastId)
        }
      }

      const cancelActionProps: ToastActionProps = {
        children: normalized.cancelText || '取消',
        onClick: async () => {
          await normalized.onCancel?.()
          resolveOnce(false)
          toastManager.close(toastId)
        }
      }

      toastId = addToast({
        title: normalized.title,
        description: normalized.content,
        timeout: 0,
        type: 'info',
        actionProps,
        data: { cancelActionProps },
        onClose: () => resolveOnce(false)
      })
    })
  },

  /**
   * Promise 提示
   * 自动显示加载、成功、失败状态
   */
  promise: <T,>(
    promiseValue: Promise<T>,
    options: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: unknown) => string)
    }
  ) => {
    const toastId = addToast({
      title: options.loading,
      timeout: 0,
      type: 'loading'
    })

    const resolveTitle = <Value,>(
      value: Value,
      resolver: string | ((input: Value) => string)
    ) => {
      return typeof resolver === 'function' ? resolver(value) : resolver
    }

    return promiseValue
      .then((result) => {
        const title = resolveTitle(result, options.success)
        toastManager.update<ToastActionData>(toastId, {
          title,
          type: 'success',
          timeout: 3000
        })
        return result
      })
      .catch((error) => {
        const title = resolveTitle(error, options.error)
        toastManager.update<ToastActionData>(toastId, {
          title,
          type: 'error',
          timeout: 4000
        })
        return Promise.reject(error)
      })
  },

  /**
   * 关闭所有提示
   */
  dismiss: (id?: string | number) => {
    const toastId = getToastId(id)
    if (toastId) {
      toastManager.close(toastId)
      return
    }

    Array.from(activeToastIds).forEach((activeId) => {
      toastManager.close(activeId)
    })
  }
}

export function useMessage() {
  return toast
}

export function useConfirm() {
  return toast.confirm
}
