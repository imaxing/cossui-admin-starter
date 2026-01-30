import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext
} from 'react'

/**
 * 字典选项
 */
export interface DictOption {
  value: string
  label: string
  description?: string
  name?: string
  uuid?: string
}

/**
 * 字典数据结构
 */
export interface DictData {
  [key: string]: DictOption[]
}

/**
 * 字典 Map 对象（用于快速查找 value -> label）
 */
export type DictMap = Record<string, string>

/**
 * 字典 API 配置接口
 */
export interface DictApiConfig {
  /**
   * 获取字典数据
   */
  defaults: () => Promise<DictData>
  /**
   * 额外的字典数据源(可选) - 声明式配置
   * key: 字典字段名, value: 获取该字典数据的函数
   */
  extras?: Record<string, () => Promise<DictOption[]>>
}

/**
 * 字典 Context
 */
const DictContext = createContext<DictApiConfig | null>(null)

/**
 * DictProvider Props
 */
export interface DictProviderProps {
  children: React.ReactNode
  config: DictApiConfig
}

export function DictProvider({ children, config }: DictProviderProps) {
  return React.createElement(DictContext.Provider, { value: config }, children)
}

let cachedDict: DictData | null = null
const cacheListeners = new Set<(dict: DictData | null) => void>()

const notifyCacheListeners = () => {
  cacheListeners.forEach((listener) => {
    listener(cachedDict)
  })
}

/**
 * 字典数据 Hook
 *
 * @example
 * const { loading, data, getOptions, getMap, refresh } = useDict()
 */
export function useDict() {
  const api_config = useContext(DictContext)

  // 如果没有 DictProvider context,尝试使用缓存数据(Dialog 场景)
  const use_cache_only = !api_config

  const [dict, setDict] = useState<DictData | null>(cachedDict)
  const [loading, setLoading] = useState(use_cache_only ? false : !cachedDict)

  // 加载数据
  const loadData = useCallback(async () => {
    // 如果没有 API 配置(Dialog 场景),只使用缓存
    if (use_cache_only) {
      return
    }

    setLoading(true)
    try {
      // 加载主字典数据
      const dictData = await api_config.defaults()

      // 方式2: extras 声明式
      if (api_config.extras) {
        const extraEntries = Object.entries(api_config.extras)
        const extraResults = await Promise.all(
          extraEntries.map(([key, fetchFn]) =>
            fetchFn().then((data) => [key, data] as const)
          )
        )
        extraResults.forEach(([key, data]) => {
          ;(dictData as any)[key] = data
        })
      }

      cachedDict = dictData
      setDict(dictData)
      notifyCacheListeners()
    } catch (error) {
      console.error('加载字典数据失败:', error)
    } finally {
      setLoading(false)
    }
  }, [api_config, use_cache_only])

  // 刷新所有字典数据
  const refresh = useCallback(async () => {
    // 如果没有 API 配置(Dialog 场景),无法刷新
    if (use_cache_only) {
      console.warn('[useDict] 在 Dialog 中无法刷新数据,只能使用缓存数据')
      return
    }

    await loadData()
  }, [loadData, use_cache_only])

  useEffect(() => {
    if (cachedDict) {
      setDict(cachedDict)
      return
    }

    loadData()
  }, [loadData])

  useEffect(() => {
    if (!use_cache_only) {
      return
    }

    const listener = (dictData: DictData | null) => {
      if (dictData) {
        setDict(dictData)
      }
    }

    cacheListeners.add(listener)
    return () => {
      cacheListeners.delete(listener)
    }
  }, [use_cache_only])

  // 生成 Map 对象（value -> label）
  const createMap = (options: DictOption[] | undefined): DictMap => {
    if (!options || !Array.isArray(options)) {
      return {}
    }
    return options.reduce((acc, item) => {
      if (item && item.value) {
        acc[item.value] = item.label || item.value
      }
      return acc
    }, {} as DictMap)
  }

  // 获取指定字典的选项
  const getOptions = (key: string): DictOption[] => {
    return dict?.[key] || []
  }

  // 获取指定字典的 Map
  const getMap = (key: string): DictMap => {
    return createMap(dict?.[key])
  }

  return {
    loading,
    // 原始数据
    data: dict,
    // 获取选项
    getOptions,
    // 获取 Map
    getMap,
    // 刷新方法
    refresh
  }
}
