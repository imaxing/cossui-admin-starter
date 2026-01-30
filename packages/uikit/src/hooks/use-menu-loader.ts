import { useState } from 'react'
import type { AdminMenuItem } from '@cat/types'

export interface UseMenuLoaderResult {
  /** 菜单数据 */
  menus: AdminMenuItem[]
  /** 加载状态 */
  loading: boolean
  /** 错误信息 */
  error: string | null
  /** 设置菜单 */
  setMenus: (menus: AdminMenuItem[]) => void
  /** 重置状态 */
  reset: () => void
}

/**
 * 菜单加载 Hook
 * 管理菜单数据状态
 */
export function useMenuLoader(): UseMenuLoaderResult {
  const [menus, setMenus] = useState<AdminMenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setMenus([])
    setError(null)
    setLoading(false)
  }

  return {
    menus,
    loading,
    error,
    setMenus,
    reset
  }
}
