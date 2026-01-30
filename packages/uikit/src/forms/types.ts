import { ReactNode } from 'react'

/**
 * Form field configuration
 */
export interface FieldOption<T = string> {
  key: string
  label?: string
  type?: 'text' | 'password' | 'email' | 'number'
  placeholder?: string
  required?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
  defaultValue?: T
  validation?: (value: T) => boolean | string
}

/**
 * Form submission data
 */
export type FormData = Record<string, any>

/**
 * Field render context
 */
export interface FieldRenderContext<T = string> {
  option: FieldOption<T>
  value: T
  error?: string
  onChange: (value: T) => void
}

/**
 * Custom field renderer
 */
export type FieldRenderer<T = string> = (
  context: FieldRenderContext<T>
) => ReactNode

/**
 * LoginForm component props
 */
export interface LoginFormProps {
  className?: string
  options: FieldOption[]
  onFinish: (data: FormData) => void | Promise<void>
  render?: FieldRenderer
  loading?: boolean
  text?: string
  icon?: ReactNode
  title?: string
}
