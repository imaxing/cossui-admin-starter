'use client'

import React from 'react'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'

// 创建禁用 preflight 的 system，避免覆盖 Tailwind 样式
const system = createSystem(defaultConfig, {
  preflight: false
})
import { Select as ChakraSelect } from 'chakra-react-select'
import type { MultiValue, SingleValue } from 'chakra-react-select'

// 选项类型
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

// Select 组件属性
export interface SelectProps {
  value?: string | number | (string | number)[]
  defaultValue?: string | number | (string | number)[]
  onChange?: (value: string | number | (string | number)[]) => void
  options?: SelectOption[]
  placeholder?: string
  disabled?: boolean
  allowClear?: boolean
  loading?: boolean
  size?: 'small' | 'medium' | 'large'
  mode?: 'multiple' | 'tags'
  className?: string
  notFoundContent?: React.ReactNode
  onClear?: () => void
}

export function Select({
  value,
  defaultValue,
  onChange,
  options = [],
  placeholder = '请选择',
  disabled = false,
  allowClear = false,
  loading = false,
  size = 'medium',
  mode,
  className,
  notFoundContent = '暂无数据',
  onClear
}: SelectProps) {
  const isMultiple = mode === 'multiple' || mode === 'tags'
  const instanceId = React.useId()

  // 根据 size 获取样式配置
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          minHeight: '32px',
          fontSize: '0.875rem',
          padding: '0 8px'
        }
      case 'large':
        return {
          minHeight: '40px',
          fontSize: '1rem',
          padding: '0 16px'
        }
      default: // medium
        return {
          minHeight: '36px',
          fontSize: '0.875rem',
          padding: '0 12px'
        }
    }
  }

  const sizeStyles = getSizeStyles()

  // 转换值为 react-select 格式
  const getValue = () => {
    if (isMultiple) {
      const arrayValue = Array.isArray(value) ? value : []
      return options.filter((opt) => arrayValue.includes(opt.value))
    }
    return options.find((opt) => opt.value === value) || null
  }

  // 处理值变化
  const handleChange = (
    newValue: MultiValue<SelectOption> | SingleValue<SelectOption>
  ) => {
    if (isMultiple) {
      const values = (newValue as MultiValue<SelectOption>).map((opt) => opt.value)
      onChange?.(values)
    } else {
      const singleVal = newValue as SingleValue<SelectOption>
      onChange?.(singleVal ? singleVal.value : '')
    }

    if (!newValue || (Array.isArray(newValue) && newValue.length === 0)) {
      onClear?.()
    }
  }

  return (
    <ChakraProvider value={system}>
      <ChakraSelect<SelectOption, boolean>
        instanceId={instanceId}
        value={getValue()}
        defaultValue={
          defaultValue
            ? isMultiple
              ? options.filter((opt) =>
                  (Array.isArray(defaultValue) ? defaultValue : []).includes(
                    opt.value
                  )
                )
              : options.find((opt) => opt.value === defaultValue)
            : undefined
        }
        onChange={handleChange}
        options={options}
        isMulti={isMultiple}
        isDisabled={disabled}
        isClearable={allowClear}
        isLoading={loading}
        isSearchable
        placeholder={placeholder}
        noOptionsMessage={() => notFoundContent}
        className={className}
        classNamePrefix="chakra-react-select"
        chakraStyles={{
          container: (provided) => ({
            ...provided,
            _focusVisible: {
              outline: 'none',
              boxShadow: 'none'
            }
          }),
          control: (provided) => ({
            ...provided,
            minHeight: sizeStyles.minHeight,
            fontSize: sizeStyles.fontSize,
            _focus: {
              boxShadow: 'none',
              borderColor: 'inherit'
            },
            _focusVisible: {
              boxShadow: 'none',
              borderColor: 'inherit'
            }
          }),
          valueContainer: (provided) => ({
            ...provided,
            padding: sizeStyles.padding
          })
        }}
      />
    </ChakraProvider>
  )
}
