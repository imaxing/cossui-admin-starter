/** @jsxImportSource react */
import React from 'react'
import createDynamicMount from 'react-dynamic-mount'
import { Drawer, Button, type DrawerProps } from '../common/index'

/**
 * 按钮配置
 */
export interface DrawerButton {
  /** 按钮文本 */
  text: string
  /** 回调方法名（组件内部方法） */
  callback: string
  /** 按钮类型 */
  type?: 'primary' | 'default' | 'danger'
  /** 是否加载状态 */
  loading?: boolean
  /** 二次确认文本（如果设置，需要点击两次才触发 callback） */
  confirm?: string
}

/**
 * 动态 Drawer 属性
 */
interface DynamicDrawerProps extends Omit<
  DrawerProps,
  'open' | 'onOpenChange' | 'children'
> {
  /** Drawer 内容（JSX） */
  component?: React.ReactNode
  /** Drawer 内容（children 别名） */
  children?: React.ReactNode
  /** 按钮配置（业务按钮） */
  buttons?: DrawerButton[]
  /** 是否显示取消按钮 */
  showCancel?: boolean
  /** 取消按钮文本 */
  cancelText?: string
  /** 是否可见（由 react-dynamic-mount 控制） */
  visible?: boolean
  /** 关闭回调 */
  onUpdate?: (props: Partial<DynamicDrawerProps>) => void
  /** 容器元素 */
  containerEl?: HTMLElement
  /** 高度（仅在 direction 为 top/bottom 时生效） */
  height?: string
}

/**
 * 动态 Drawer 包装组件
 */
function DrawerWrapper(props: DynamicDrawerProps) {
  const {
    onUpdate,
    component,
    children,
    visible = true,
    buttons = [],
    showCancel = true,
    cancelText = '取消',
    ...rest
  } = props
  const componentRef = React.useRef<Record<string, unknown> | null>(null)
  const [loadingStates, setLoadingStates] = React.useState<
    Record<string, boolean>
  >({})
  const [activeConfirmButton, setActiveConfirmButton] = React.useState<
    string | null
  >(null)
  const confirmTimer = React.useRef<NodeJS.Timeout | null>(null)

  const handleClose = () => {
    onUpdate?.({ visible: false })
  }

  // 处理按钮点击
  const handleButtonClick = async (button: DrawerButton) => {
    if (!componentRef.current) return

    // 如果有二次确认
    if (button.confirm) {
      if (activeConfirmButton === button.callback) {
        // 第二次点击：执行回调
        if (confirmTimer.current) {
          clearTimeout(confirmTimer.current)
          confirmTimer.current = null
        }
        setActiveConfirmButton(null)

        const method = componentRef.current[button.callback]
        if (typeof method === 'function') {
          setLoadingStates((prev) => ({ ...prev, [button.callback]: true }))
          try {
            await method()
          } finally {
            setLoadingStates((prev) => ({ ...prev, [button.callback]: false }))
          }
        }
      } else {
        // 第一次点击：清除其他按钮的确认状态，显示当前按钮的确认文本
        if (confirmTimer.current) {
          clearTimeout(confirmTimer.current)
        }
        setActiveConfirmButton(button.callback)

        // 设置 3 秒后恢复
        confirmTimer.current = setTimeout(() => {
          setActiveConfirmButton(null)
          confirmTimer.current = null
        }, 3000)
      }
    } else {
      // 没有二次确认，直接执行
      const method = componentRef.current[button.callback]
      if (typeof method === 'function') {
        setLoadingStates((prev) => ({ ...prev, [button.callback]: true }))
        try {
          await method()
        } finally {
          setLoadingStates((prev) => ({ ...prev, [button.callback]: false }))
        }
      }
    }
  }

  // 清理定时器
  React.useEffect(() => {
    return () => {
      if (confirmTimer.current) {
        clearTimeout(confirmTimer.current)
      }
    }
  }, [])

  // 渲染 footer 按钮
  const renderFooter = () => {
    const hasButtons = buttons.length > 0
    if (!hasButtons && !showCancel) return undefined

    return (
      <div className="flex justify-end gap-3">
        {/* 取消按钮 */}
        {showCancel && (
          <Button type="default" onClick={handleClose}>
            {cancelText}
          </Button>
        )}
        {/* 业务按钮 */}
        {buttons.map((button, index) => {
          const isCancel = button.callback === 'cancel'
          const isConfirming = activeConfirmButton === button.callback
          const displayText = isConfirming ? button.confirm : button.text
          return (
            <Button
              key={index}
              type={button.type || 'default'}
              onClick={() => handleButtonClick(button)}
              loading={loadingStates[button.callback]}
              data-cancel-button={isCancel || undefined}
            >
              {displayText}
            </Button>
          )
        })}
      </div>
    )
  }

  // 增强组件：注入 onClose 和 ref
  const enhancedComponent = React.useMemo(() => {
    if (!React.isValidElement(component)) {
      return component || children
    }

    return React.cloneElement(component as React.ReactElement<Record<string, unknown>>, {
      ref: componentRef,
      onClose: handleClose
    } as Record<string, unknown>)
  }, [component, children])

  return (
    <Drawer
      {...rest}
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          handleClose()
        }
      }}
      footer={renderFooter()}
      showOkButton={false}
      showCancelButton={false}
    >
      {enhancedComponent}
    </Drawer>
  )
}

/**
 * 创建动态 Drawer
 *
 * @example
 * createDrawer({
 *   title: '编辑用户',
 *   direction: 'bottom',
 *   component: (
 *     <UserForm
 *       initialData={user}
 *       onSubmit={async (data) => {
 *         await updateUser(data);
 *         toast.success('更新成功');
 *       }}
 *     />
 *   ),
 *   buttons: [
 *     { text: '确定', callback: 'submit', type: 'primary' }
 *   ],
 * });
 */
export const createDrawer = createDynamicMount<DynamicDrawerProps>({
  extend: DrawerWrapper
})
