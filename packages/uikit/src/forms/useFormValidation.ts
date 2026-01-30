import { useState, useCallback } from 'react'
import type { FieldOption, FormData } from './types'

interface ValidationErrors {
  [key: string]: string
}

export function useFormValidation(options: FieldOption[], values: FormData) {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validate = useCallback((): boolean => {
    const newErrors: ValidationErrors = {}

    options.forEach((option) => {
      const value = values[option.key]

      // 必填校验
      if (option.required && !value) {
        newErrors[option.key] = `${option.label || option.key} is required`
        return
      }

      // 自定义校验规则
      if (option.validation && value) {
        const result = option.validation(value)
        if (result !== true) {
          newErrors[option.key] = typeof result === 'string' ? result : 'Validation failed'
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [options, values])

  const clearError = useCallback((key: string) => {
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  return {
    errors,
    validate,
    clearError
  }
}
