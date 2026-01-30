import { useState, ReactNode } from 'react'
import type { LoginFormProps, FieldOption, FormData, FieldRenderContext } from './types'
import { useFormValidation } from './useFormValidation'
import { Input } from '../common/Input'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'

export type { LoginFormProps, FieldOption, FormData, FieldRenderContext, FieldRenderer } from './types'

/**
 * Password field with visibility toggle
 */
function PasswordField({
  option,
  value,
  error,
  onChange
}: {
  option: FieldOption
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  const [visible, setVisible] = useState(false)
  const { key, label, placeholder, prefix } = option

  const suffixIcon = (
    <button
      type='button'
      onClick={() => setVisible(!visible)}
      style={{ opacity: value ? 1 : 0 }}
      className={`-mr-3 text-muted-foreground transition-all duration-200 hover:text-foreground ${
        value ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {visible ? (
        <svg className='h-4 w-4' fill='none' stroke='currentColor' strokeWidth={1.5} viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
          />
        </svg>
      ) : (
        <svg className='h-4 w-4' fill='none' stroke='currentColor' strokeWidth={1.5} viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
          />
          <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
        </svg>
      )}
    </button>
  )

  return (
    <div key={key} className='group relative'>
      {label && (
        <label
          htmlFor={key}
          className='block text-xs font-medium text-muted-foreground mb-2 transition-colors group-focus-within:text-foreground'
        >
          {label}
        </label>
      )}
      <Input
        id={key}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        status={error ? 'error' : undefined}
        prefix={prefix}
        suffix={suffixIcon}
      />
      {error && (
        <p className='text-xs text-destructive mt-1.5'>
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Default input field
 */
function DefaultField({
  option,
  value,
  error,
  onChange
}: {
  option: FieldOption
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  const { key, label, type = 'text', placeholder, prefix, suffix } = option

  if (type === 'password') {
    return <PasswordField option={option} value={value} error={error} onChange={onChange} />
  }

  return (
    <div key={key} className='group relative'>
      {label && (
        <label
          htmlFor={key}
          className='block text-xs font-medium text-muted-foreground mb-2 transition-colors group-focus-within:text-foreground'
        >
          {label}
        </label>
      )}
      <Input
        id={key}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        status={error ? 'error' : undefined}
        prefix={prefix}
        suffix={suffix}
      />
      {error && (
        <p className='text-xs text-destructive mt-1.5'>
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Main LoginForm component
 */
export function LoginForm({
  className = '',
  options,
  render = DefaultField,
  onFinish,
  loading = false,
  text = 'sign in',
  icon,
  title = '欢迎登录'
}: LoginFormProps) {
  const [values, setValues] = useState<FormData>(() =>
    options.reduce<FormData>((acc, option) => {
      acc[option.key] = option.defaultValue ?? ''
      return acc
    }, {})
  )

  const { errors, validate, clearError } = useFormValidation(options, values)

  const handleSubmit = async () => {
    if (validate()) {
      await onFinish(values)
    }
  }

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }))
    clearError(key)
  }

  const isDisabled = loading || options.some(opt => opt.required && !values[opt.key])

  return (
    <div className={`relative w-full h-screen bg-background flex items-center justify-center p-6 ${className}`}>
      <div className='w-full max-w-[400px] animate-[fadeInUp_0.5s_ease-out]'>
        <div className='relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-lg p-8 transition-all duration-300 hover:shadow-xl'>
          <div className='mb-8'>
            {icon && (
              <div className='mb-6'>
                <div className='inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted border border-border shadow-sm transition-transform duration-300 hover:scale-105'>
                  {icon}
                </div>
              </div>
            )}
            <h1 className='text-2xl font-semibold text-foreground tracking-tight leading-tight mb-2'>
              {title}
            </h1>
            <div className='w-12 h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full' />
          </div>
          <div
            className='space-y-5'
            onKeyPress={e => {
              if (e.key === 'Enter') handleSubmit()
            }}
          >
            {options.map((option) => (
              <div key={option.key}>
                {render({
                  option,
                  value: values[option.key],
                  error: errors[option.key],
                  onChange: value => handleChange(option.key, value)
                })}
              </div>
            ))}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isDisabled}
            className='mt-7 w-full'
            variant='outline'
            size='lg'
          >
            {loading && <Spinner />}
            {!loading && text}
          </Button>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  )
}
