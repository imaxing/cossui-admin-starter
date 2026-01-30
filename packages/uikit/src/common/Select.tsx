'use client'

import * as React from 'react'
import { X, ChevronDown, Check } from 'lucide-react'
import {
  Select as SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '../lib/utils'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

// 空值占位符，用于处理 Radix Select 不允许空字符串的问题
const EMPTY_VALUE = '__empty__'

function toInternalValue(val: string | number | undefined): string | undefined {
  if (val === undefined) return undefined
  return val === '' ? EMPTY_VALUE : String(val)
}

function toExternalValue(val: string): string {
  return val === EMPTY_VALUE ? '' : val
}

// 单选模式 Props
interface SingleSelectProps {
  multiple?: false
  value?: string | number
  defaultValue?: string | number
  onChange?: (value: string) => void
}

// 多选模式 Props
interface MultiSelectProps {
  multiple: true
  value?: (string | number)[]
  defaultValue?: (string | number)[]
  onChange?: (value: (string | number)[]) => void
  maxDisplay?: number
}

// 通用 Props
interface BaseSelectProps {
  options?: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export type SelectProps = BaseSelectProps & (SingleSelectProps | MultiSelectProps)

export function Select(props: SelectProps) {
  const {
    options = [],
    placeholder = '请选择',
    disabled = false,
    className
  } = props

  if (props.multiple) {
    return <MultiSelectInner {...props} options={options} placeholder={placeholder} disabled={disabled} className={className} />
  }

  return <SingleSelectInner {...props} options={options} placeholder={placeholder} disabled={disabled} className={className} />
}

// 单选组件
function SingleSelectInner({
  value,
  defaultValue,
  onChange,
  options,
  placeholder,
  disabled,
  className
}: BaseSelectProps & SingleSelectProps) {
  return (
    <SelectRoot
      value={toInternalValue(value)}
      defaultValue={toInternalValue(defaultValue)}
      onValueChange={(val) => onChange?.(toExternalValue(val))}
      disabled={disabled}
    >
      <SelectTrigger className={cn('w-full', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.map((opt) => (
          <SelectItem
            key={opt.value === '' ? EMPTY_VALUE : opt.value}
            value={opt.value === '' ? EMPTY_VALUE : String(opt.value)}
            disabled={opt.disabled}
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}

// 多选组件
function MultiSelectInner({
  value,
  defaultValue,
  onChange,
  options = [],
  placeholder,
  disabled,
  className,
  maxDisplay = 4
}: BaseSelectProps & MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState<(string | number)[]>(
    defaultValue || []
  )

  const selectedValues = value !== undefined ? value : internalValue

  const handleSelect = (optValue: string | number) => {
    const newValue = selectedValues.includes(optValue)
      ? selectedValues.filter((v) => v !== optValue)
      : [...selectedValues, optValue]

    if (value === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  const handleRemove = (e: React.MouseEvent, optValue: string | number) => {
    e.stopPropagation()
    const newValue = selectedValues.filter((v) => v !== optValue)
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (value === undefined) {
      setInternalValue([])
    }
    onChange?.([])
  }

  const selectedOptions = options.filter((opt) =>
    selectedValues.includes(opt.value)
  )

  const displayOptions = selectedOptions.slice(0, maxDisplay)
  const moreCount = selectedOptions.length - maxDisplay

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            'flex min-h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ring-offset-background',
            'focus:outline-none focus:ring-1 focus:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          disabled={disabled}
        >
          <div className="flex flex-1 flex-wrap gap-1">
            {selectedValues.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {displayOptions.map((opt) => (
                  <span
                    key={opt.value}
                    className="inline-flex items-center gap-1 rounded border border-input bg-background px-1.5 py-0.5 text-xs"
                  >
                    {opt.label}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={(e) => handleRemove(e, opt.value)}
                    />
                  </span>
                ))}
                {moreCount > 0 && (
                  <span className="inline-flex items-center rounded border border-input bg-background px-1.5 py-0.5 text-xs">
                    +{moreCount}
                  </span>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            {selectedValues.length > 0 && (
              <X
                className="h-4 w-4 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0" 
        align="start"
        style={{ minWidth: 'var(--radix-popover-trigger-width)' }}
      >
        {options.length === 0 ? (
          <div className="py-2 text-center text-sm text-muted-foreground">
            暂无选项
          </div>
        ) : (
          <ScrollArea className="max-h-72">
            <div className="p-1">
              {options.map((opt) => {
                const isSelected = selectedValues.includes(opt.value)
                return (
                  <div
                    key={opt.value}
                    className={cn(
                      'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none',
                      'hover:bg-accent hover:text-accent-foreground',
                      opt.disabled && 'pointer-events-none opacity-50'
                    )}
                    onClick={() => !opt.disabled && handleSelect(opt.value)}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}
