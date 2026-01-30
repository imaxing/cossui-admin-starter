'use client'

import React from 'react'
import { Input as UIInput } from '../ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from '../ui/input-group'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { Textarea } from '../ui/textarea'
import { cn } from '../lib'

// Input 组件属性
export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'prefix' | 'suffix'
  > {
  size?: 'small' | 'medium' | 'large'
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  addonBefore?: React.ReactNode
  addonAfter?: React.ReactNode
  allowClear?: boolean
  showCount?: boolean
  status?: 'error' | 'warning'
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onClear?: () => void
}

export function Input({
  size = 'medium',
  prefix,
  suffix,
  addonBefore,
  addonAfter,
  allowClear = false,
  showCount = false,
  status,
  className,
  style,
  value,
  maxLength,
  disabled,
  onChange,
  onPressEnter,
  onClear,
  ...rest
}: InputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onPressEnter?.(e)
    }
  }

  const handleClear = () => {
    const event = {
      target: { value: '' }
    } as React.ChangeEvent<HTMLInputElement>
    onChange?.(event)
    onClear?.()
  }

  const inputSize = size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'default'
  const hasAddon = addonBefore || addonAfter
  const hasAffix = prefix || suffix || (allowClear && value) || showCount

  // 简单模式：无 addon 和 affix
  if (!hasAddon && !hasAffix) {
    return (
      <UIInput
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        size={inputSize}
        aria-invalid={status === 'error' ? true : undefined}
        className={cn(
          status === 'error' && 'border-destructive',
          status === 'warning' && 'border-warning',
          className
        )}
        style={style}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        {...rest}
      />
    )
  }

  const renderAddon = (node: React.ReactNode) => {
    if (node === undefined || node === null) return null
    if (typeof node === 'string' || typeof node === 'number') {
      return <InputGroupText>{node}</InputGroupText>
    }
    return node
  }

  return (
    <InputGroup className={cn(className)} style={style}>
      {addonBefore && (
        <InputGroupAddon align="inline-start">
          {renderAddon(addonBefore)}
        </InputGroupAddon>
      )}
      {prefix && (
        <InputGroupAddon align="inline-start">
          {renderAddon(prefix)}
        </InputGroupAddon>
      )}
      <InputGroupInput
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        size={inputSize}
        aria-invalid={status === 'error' ? true : undefined}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        {...rest}
      />
      {(allowClear || showCount || suffix) && (
        <InputGroupAddon align="inline-end">
          {allowClear && value && !disabled && (
            <Button
              size="icon-xs"
              variant="ghost"
              type="button"
              onClick={handleClear}
              className="hover:opacity-70"
            >
              <X className="size-3.5" />
            </Button>
          )}
          {showCount && maxLength && (
            <InputGroupText className="text-xs text-muted-foreground">
              {String(value || '').length}/{maxLength}
            </InputGroupText>
          )}
          {suffix && renderAddon(suffix)}
        </InputGroupAddon>
      )}
      {addonAfter && (
        <InputGroupAddon align="inline-end">
          {renderAddon(addonAfter)}
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

// TextArea 组件
export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  size?: 'small' | 'medium' | 'large'
  showCount?: boolean
  autoSize?: boolean | { minRows?: number; maxRows?: number }
  status?: 'error' | 'warning'
}

export function TextArea({
  size = 'medium',
  rows = 4,
  maxLength,
  showCount = false,
  autoSize = false,
  className,
  style,
  value,
  disabled,
  status,
  ...rest
}: TextAreaProps) {
  const textareaSize =
    size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'default'
  const minRows = typeof autoSize === 'object' ? autoSize.minRows : rows
  const maxRows = typeof autoSize === 'object' ? autoSize.maxRows : undefined

  return (
    <div className="relative w-full">
      <Textarea
        value={value}
        disabled={disabled}
        rows={autoSize ? minRows : rows}
        maxLength={maxLength}
        size={textareaSize}
        aria-invalid={status === 'error' ? true : undefined}
        className={cn(
          status === 'error' && 'border-destructive',
          status === 'warning' && 'border-warning',
          className
        )}
        style={{
          ...style,
          ...(maxRows && { maxHeight: `${maxRows * 1.5}em` })
        }}
        {...rest}
      />
      {showCount && maxLength && (
        <div className="mt-1 text-right text-xs text-muted-foreground">
          {String(value || '').length}/{maxLength}
        </div>
      )}
    </div>
  )
}
