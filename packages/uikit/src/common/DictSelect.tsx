'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Select, type SelectOption } from './Select'

export type DictSelectOption = SelectOption

export interface DictSelectProps {
  api: (params?: Record<string, any>) => Promise<any>
  params?: Record<string, any>
  value?: string | number | (string | number)[]
  onChange?: (value: string | number | (string | number)[]) => void
  placeholder?: string
  disabled?: boolean
  allowClear?: boolean
  loading?: boolean
  className?: string
  multiple?: boolean
  mapOption?: (item: any) => DictSelectOption | null
}

const defaultMapOption = (item: any): DictSelectOption | null => {
  if (!item) return null
  const value = item.value ?? item.code ?? item.uuid ?? item.id
  if (value === undefined || value === null || value === '') return null
  const label = item.label ?? item.name ?? String(value)
  return { value, label }
}

export function DictSelect({
  api,
  params,
  value,
  onChange,
  placeholder,
  disabled,
  allowClear,
  loading: externalLoading,
  className,
  multiple,
  mapOption = defaultMapOption
}: DictSelectProps) {
  const [options, setOptions] = useState<DictSelectOption[]>([])
  const [loading, setLoading] = useState(false)
  const lastRequestRef = useRef<{ api: DictSelectProps['api']; key: string } | null>(
    null
  )
  const paramsKey = useMemo(() => JSON.stringify(params || {}), [params])

  useEffect(() => {
    let cancelled = false
    const loadOptions = async () => {
      const lastRequest = lastRequestRef.current
      if (
        lastRequest &&
        lastRequest.api === api &&
        lastRequest.key === paramsKey &&
        options.length > 0
      ) {
        return
      }
      lastRequestRef.current = { api, key: paramsKey }
      setLoading(true)
      try {
        const response = await api(params)
        const list = Array.isArray(response) ? response : response?.data || []
        const mapped = (list as any[])
          .map((item) => mapOption(item))
          .filter(Boolean) as DictSelectOption[]
        if (!cancelled) {
          setOptions(mapped)
        }
      } catch (error) {
        console.error('[DictSelect] 加载字典选项失败:', error)
        if (!cancelled) {
          setOptions([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadOptions()
    return () => {
      cancelled = true
    }
  }, [api, params, paramsKey, mapOption, options.length])

  return (
    <Select
      value={value}
      mode={multiple ? 'multiple' : undefined}
      onChange={(nextValue) => {
        if (multiple) {
          onChange?.(Array.isArray(nextValue) ? nextValue : [nextValue])
          return
        }
        if (Array.isArray(nextValue)) {
          return
        }
        onChange?.(nextValue)
      }}
      placeholder={placeholder}
      disabled={disabled}
      allowClear={allowClear}
      options={options}
      loading={externalLoading ?? loading}
      className={className}
    />
  )
}
