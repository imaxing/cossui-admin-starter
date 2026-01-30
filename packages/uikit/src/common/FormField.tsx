'use client'

import type * as React from 'react'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldItem
} from '../ui/field'
import { cn } from '../lib'

export interface FormFieldProps {
  /** 字段标签 */
  label?: string
  /** 字段 ID（用于 label 的 htmlFor） */
  name?: string
  /** 是否必填 */
  required?: boolean
  /** 错误提示信息 */
  error?: string
  /** 帮助文本 */
  help?: string
  /** 字段控件 */
  children: React.ReactNode
  /** 标签布局方式 */
  layout?: 'vertical' | 'horizontal'
  /** 标签宽度（horizontal 布局时有效） */
  labelWidth?: number | string
  /** 容器类名 */
  className?: string
  /** 标签类名 */
  labelClassName?: string
  /** 控件容器类名 */
  controlClassName?: string
}

export function FormField({
  label,
  name,
  required = false,
  error,
  help,
  children,
  layout = 'vertical',
  labelWidth = 100,
  className,
  labelClassName,
  controlClassName
}: FormFieldProps) {
  const isHorizontal = layout === 'horizontal'

  return (
    <Field className={cn(className)}>
      {label && (
        <div
          style={
            isHorizontal ? { width: labelWidth, flexShrink: 0 } : undefined
          }
        >
          <FieldLabel htmlFor={name} className={cn(labelClassName)}>
            {label}
            {required && <span>*</span>}
          </FieldLabel>
        </div>
      )}

      <FieldItem className={cn(controlClassName)}>
        {children}

        {error && <FieldError>{error}</FieldError>}

        {!error && help && <FieldDescription>{help}</FieldDescription>}
      </FieldItem>
    </Field>
  )
}
