'use client'

import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput
} from '../ui/number-field'
import { cn } from '../lib'

export interface InputNumberProps {
  /** ID */
  id?: string
  /** 值 */
  value?: number
  /** 变更回调 */
  onChange?: (value: number | null) => void
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步长 */
  step?: number
  /** 占位符 */
  placeholder?: string
  /** 禁用 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
}

/**
 * 数字输入框组件
 * 基于 shadcn/ui Input 组件封装
 */
export function InputNumber({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  disabled = false,
  className
}: InputNumberProps) {
  const controlledValue =
    value === undefined || value === null ? null : value

  return (
    <NumberField
      id={id}
      min={min}
      max={max}
      step={step}
      value={controlledValue}
      disabled={disabled}
      onValueChange={(nextValue) => onChange?.(nextValue)}
    >
      <NumberFieldGroup className={cn(className)}>
        <NumberFieldInput placeholder={placeholder} />
      </NumberFieldGroup>
    </NumberField>
  )
}
