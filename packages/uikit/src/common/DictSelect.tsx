'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Select, type SelectOption } from './Select'

export type DictSelectOption = SelectOption

export interface DictSelectProps {
  api: (params?: Record<string, unknown>) => Promise<unknown>
  params?: Record<string, unknown>
  value?: string | number
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  mapOption?: (item: unknown) => DictSelectOption | null
}

const defaultMapOption = (item: unknown): DictSelectOption | null => {
  if (!item || typeof item !== 'object') return null
  const obj = item as Record<string, unknown>
  const value = obj.value ?? obj.code ?? obj.uuid ?? obj.id
  if (value === undefined || value === null || value === '') return null
  const label = obj.label ?? obj.name ?? String(value)
  return { value: String(value), label: String(label) }
}

export function DictSelect({
  api,
  params,
  value,
  onChange,
  placeholder,
  disabled,
  className,
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
        const list = Array.isArray(response)
          ? response
          : (response as Record<string, unknown>)?.data || []
        const mapped = (list as unknown[])
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
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled || loading}
      options={options}
      className={className}
    />
  )
}
