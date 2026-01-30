import { useState } from 'react'
import { requestWithCurrentOrigin } from '@koala/shared'
import type { AdminMenuItem } from '@koala/types'

export interface UseMenuLoaderResult {
  /** 菜单数据 */
  menus: AdminMenuItem[]
  /** 加载状态 */
  loading: boolean
  /** 错误信息 */
  error: string | null
  /** 加载菜单方法 */
  loadMenus: (appUuid: string) => Promise<void>
  /** 重置状态 */
  reset: () => void
}

/**
 * 菜单加载 Hook
 * 负责从指定 URL 加载菜单数据
 */
export function useMenuLoader(): UseMenuLoaderResult {
  const [menus, setMenus] = useState<AdminMenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMenus = async (appUuid: string) => {
    if (!appUuid.trim()) {
      setError('应用UUID不能为空')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log(`[useMenuLoader] 从服务端加载应用菜单: ${appUuid}`)

      const result = await requestWithCurrentOrigin<
        { data?: unknown } | unknown
      >({
        method: 'get',
        url: `/auth/admin/apps/${appUuid}/remote-menus`
      })

      const data =
        result && typeof result === 'object' && 'data' in result
          ? (result as { data?: unknown }).data ?? result
          : result

      if (!Array.isArray(data)) {
        throw new Error('菜单数据格式错误，应该是一个数组')
      }

      console.log(`[useMenuLoader] 加载成功，菜单项数量: ${data.length}`)
      setMenus(data)
      setError(null)
    } catch (err) {
      console.error('加载菜单失败:', err)
      const errorMessage =
        err instanceof Error ? err.message : '加载菜单失败'
      setError(errorMessage)
      setMenus([])
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setMenus([])
    setError(null)
    setLoading(false)
  }

  return {
    menus,
    loading,
    error,
    loadMenus,
    reset
  }
}
