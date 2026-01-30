'use client'

import React from 'react'
import { Checkbox as CossCheckbox } from '../ui/checkbox'
import { Label } from './Label'
import { cn } from '../lib'

/**
 * Checkbox Props
 */
export interface CheckboxProps extends React.ComponentPropsWithoutRef<
  typeof CossCheckbox
> {
  label?: React.ReactNode
  description?: string
}

/**
 * Checkbox 组件
 *
 * 封装 shadcn Checkbox,支持label和描述
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="同意条款"
 *   description="请仔细阅读用户协议"
 *   checked={agreed}
 *   onCheckedChange={setAgreed}
 * />
 * ```
 */
export function Checkbox({
  label,
  description,
  className,
  id,
  ...props
}: CheckboxProps) {
  const generatedId = React.useId()
  const checkboxId = id || generatedId

  if (!label && !description) {
    return <CossCheckbox className={cn(className)} {...props} />
  }

  return (
    <div>
      <CossCheckbox id={checkboxId} className={cn(className)} {...props} />
      <div>
        {label && <Label htmlFor={checkboxId}>{label}</Label>}
        {description && <p>{description}</p>}
      </div>
    </div>
  )
}
