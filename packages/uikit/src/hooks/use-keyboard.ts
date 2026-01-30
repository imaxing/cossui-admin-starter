import { useEffect, useRef } from 'react'

/**
 * 键盘事件处理器类型
 */
export type KeyboardHandler = (event: KeyboardEvent) => void | Promise<void>

/**
 * 键盘监听配置
 */
export interface UseKeyboardOptions {
  /** 要监听的按键 */
  key: string
  /** 是否需要 Ctrl/Cmd 键 */
  ctrl?: boolean
  /** 是否需要 Shift 键 */
  shift?: boolean
  /** 是否需要 Alt 键 */
  alt?: boolean
  /** 是否阻止默认行为 */
  prevent_default?: boolean
  /** 是否阻止事件冒泡 */
  stop_propagation?: boolean
  /** 是否在捕获阶段触发 */
  capture?: boolean
  /** 是否启用(可用于条件监听) */
  enabled?: boolean
}

/**
 * 键盘监听 Hook
 * 用于监听特定按键组合并执行回调
 *
 * @example
 * // 监听 ESC 键
 * useKeyboard({
 *   key: 'Escape',
 *   prevent_default: true,
 *   stop_propagation: true
 * }, async () => {
 *   const confirmed = await toast.confirm('确定要关闭吗？')
 *   if (confirmed) {
 *     onClose()
 *   }
 * })
 *
 * @example
 * // 监听 Ctrl+S 保存
 * useKeyboard({
 *   key: 's',
 *   ctrl: true,
 *   prevent_default: true
 * }, handleSave)
 */
export function useKeyboard(
  options: UseKeyboardOptions,
  handler: KeyboardHandler
) {
  const {
    key,
    ctrl = false,
    shift = false,
    alt = false,
    prevent_default = false,
    stop_propagation = false,
    capture = false,
    enabled = true
  } = options

  const handler_ref = useRef(handler)
  const is_processing = useRef(false)

  // 保持 handler 引用最新
  useEffect(() => {
    handler_ref.current = handler
  }, [handler])

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = async (event: KeyboardEvent) => {
      // 检查按键是否匹配
      const key_match = event.key === key
      const ctrl_match = ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey
      const shift_match = shift ? event.shiftKey : !event.shiftKey
      const alt_match = alt ? event.altKey : !event.altKey

      if (!key_match || !ctrl_match || !shift_match || !alt_match) {
        return
      }

      // 防止重复触发
      if (is_processing.current) {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      // 阻止默认行为
      if (prevent_default) {
        event.preventDefault()
      }

      // 阻止事件冒泡
      if (stop_propagation) {
        event.stopPropagation()
        event.stopImmediatePropagation()
      }

      // 执行回调
      is_processing.current = true
      try {
        await handler_ref.current(event)
      } finally {
        is_processing.current = false
      }
    }

    document.addEventListener('keydown', handleKeyDown, { capture })

    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture })
    }
  }, [key, ctrl, shift, alt, prevent_default, stop_propagation, capture, enabled])
}

/**
 * ESC 键监听 Hook(快捷方式)
 */
export function useEscapeKey(handler: KeyboardHandler, enabled = true) {
  useKeyboard(
    {
      key: 'Escape',
      prevent_default: true,
      stop_propagation: true,
      capture: true,
      enabled
    },
    handler
  )
}
