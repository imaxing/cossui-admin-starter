/**
 * Layout 主题切换组件
 */

import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon } from './Icons'

export function ThemeToggle({
  theme: controlledTheme,
  onTheme
}: {
  theme?: 'light' | 'dark'
  onTheme?: (theme: 'light' | 'dark') => void
}) {
  const [is_mounted, set_is_mounted] = useState(false)
  const [internalTheme, setInternalTheme] = useState<'light' | 'dark'>('light')
  const isControlled = controlledTheme !== undefined
  const currentTheme = isControlled ? controlledTheme : internalTheme

  useEffect(() => {
    set_is_mounted(true)
  }, [])

  useEffect(() => {
    if (!isControlled) {
      const isDark = document.documentElement.classList.contains('dark')
      setInternalTheme(isDark ? 'dark' : 'light')
    }
  }, [isControlled])

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'

    if (!isControlled) {
      setInternalTheme(newTheme)
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    onTheme?.(newTheme)
  }

  if (!is_mounted) {
    return (
      <button
        className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="切换主题"
      />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label="切换主题"
    >
      {currentTheme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}
