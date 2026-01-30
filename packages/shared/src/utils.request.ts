/// <reference lib="dom" />
import { AUTH_ADMIN_TOKEN_KEY, APP_TOKEN_KEY } from '@koala/constants'
const isBrowser = typeof window !== 'undefined'

const normalizeBaseUrl = (envBaseUrl?: string): string | undefined => {
  if (!envBaseUrl) return undefined

  return envBaseUrl.endsWith('/') ? envBaseUrl.slice(0, -1) : envBaseUrl
}

const normalizePrefix = (prefix: string): string => {
  const trimmed = prefix.trim()
  if (!trimmed) return ''

  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withSlash.endsWith('/') ? withSlash.slice(0, -1) : withSlash
}

const isAbsoluteUrl = (url: string): boolean => {
  return /^https?:\/\//i.test(url)
}

type ResolveBaseUrlParams = {
  requestBaseUrl?: string
  baseUrl?: string
  serverBaseUrl?: string
}

const resolveBaseUrl = ({
  requestBaseUrl,
  baseUrl,
  serverBaseUrl
}: ResolveBaseUrlParams): string | undefined => {
  if (requestBaseUrl) return normalizeBaseUrl(requestBaseUrl)

  const resolvedBaseUrl = isBrowser ? baseUrl : serverBaseUrl || baseUrl
  return normalizeBaseUrl(resolvedBaseUrl)
}

type BuildPrefixedUrlParams = {
  prefix: string
  url: string
}

const buildPrefixedUrl = ({ prefix, url }: BuildPrefixedUrlParams): string => {
  if (!prefix) return url
  if (isAbsoluteUrl(url)) return url

  const normalizedUrl = url.startsWith('/') ? url : `/${url}`
  if (normalizedUrl === prefix) return normalizedUrl
  if (normalizedUrl.startsWith(`${prefix}/`)) return normalizedUrl

  return `${prefix}${normalizedUrl}`
}

// 全局错误处理回调（由上层应用注入）
let globalErrorHandler: ((message: string) => void) | null = null

/**
 * 设置全局请求错误处理器
 * 应在应用初始化时调用，注入 toast.error 等错误提示方法
 */
export function setRequestErrorHandler(handler: (message: string) => void) {
  globalErrorHandler = handler
}

// 安全的错误提示
const safeToast = {
  error: (message: string) => {
    if (isBrowser) {
      if (globalErrorHandler) {
        globalErrorHandler(message)
      } else {
        // Fallback: 如果未注入错误处理器，使用 console.error
        console.error('[Request Error]:', message)
      }
    }
  }
}

export interface RequestConfig<TParams = Record<string, unknown>> {
  method?:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'patch'
  url: string
  params?: TParams
  data?: unknown
  headers?: Record<string, string>
  baseURL?: string
  tokenKey?: string
}

export class RequestError extends Error {
  public status?: number
  public data?: unknown

  constructor(message: string, status?: number, data?: unknown) {
    super(message)
    this.status = status
    this.data = data
    this.name = 'RequestError'
  }
}

const resolveErrorMessage = (data: unknown, fallback: string): string => {
  if (!data || typeof data !== 'object') return fallback
  if (!('message' in data)) return fallback

  const message = (data as { message?: unknown }).message
  if (typeof message !== 'string') return fallback

  const trimmed = message.trim()
  if (!trimmed) return fallback

  return trimmed
}

const isStandardResponse = (
  data: unknown
): data is { code: unknown; data: unknown } => {
  if (!data || typeof data !== 'object') return false
  if (!('code' in data)) return false
  if (!('data' in data)) return false

  return true
}

const isRecordParams = (params: unknown): params is Record<string, unknown> => {
  if (!params || typeof params !== 'object') return false
  if (params instanceof URLSearchParams) return false
  if (Array.isArray(params)) return false

  return true
}

const appendSearchParams = ({
  searchParams,
  params
}: {
  searchParams: URLSearchParams
  params: unknown
}) => {
  if (!params) return

  if (params instanceof URLSearchParams) {
    params.forEach((value, key) => {
      searchParams.append(key, value)
    })
    return
  }

  if (!isRecordParams(params)) return

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          searchParams.append(key, String(item))
        }
      })
      return
    }

    searchParams.append(key, String(value))
  })
}

export async function request<T = unknown, TParams = Record<string, unknown>>(
  config: RequestConfig<TParams>
): Promise<T> {
  const {
    method: rawMethod = 'GET',
    url,
    params,
    data,
    headers = {},
    baseURL,
    tokenKey = 'auth_token'
  } = config
  const method = rawMethod.toUpperCase()

  // 构建完整 URL
  let fullUrl: string

  if (isBrowser) {
    // 浏览器端：必须直连 API（避免任何代理）
    if (!baseURL) {
      throw new RequestError('缺少 API 直连地址配置')
    }
    const apiBase = baseURL
    fullUrl = `${apiBase}${url.startsWith('/') ? url : `/${url}`}`

    // 添加查询参数
    const searchParams = new URLSearchParams()
    appendSearchParams({ searchParams, params })

    // 添加时间戳参数避免 CORS preflight 缓存
    searchParams.append('_t', Date.now().toString())

    const queryString = searchParams.toString()
    if (queryString) {
      fullUrl += `?${queryString}`
    }
  } else {
    // 服务器端：构建完整 URL
    const apiBase = baseURL || process.env.API_GATEWAY_URL
    const urlObj = new URL(url.startsWith('/') ? url : `/${url}`, apiBase)

    // 添加查询参数
    appendSearchParams({ searchParams: urlObj.searchParams, params })

    fullUrl = urlObj.toString()
  }

  // 构建请求配置
  const fetchConfig: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    credentials: 'include'
  }

  // 添加 Authorization header（从 Cookie 获取 token）
  if (isBrowser) {
    const token = document.cookie
      .split('; ')
      .find((row: string) => row.startsWith(`${tokenKey}=`))
      ?.split('=')[1]

    if (token && fetchConfig.headers) {
      const resolvedHeaders = fetchConfig.headers as Record<string, string>
      resolvedHeaders['Authorization'] = `Bearer ${token}`
    }
  }

  // 添加请求体
  if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
    fetchConfig.body = JSON.stringify(data)
    console.log('[Request] 发送请求:', method, fullUrl, '数据:', data)
  }

  try {
    const response = await fetch(fullUrl, fetchConfig)

    // 处理非 2xx 响应
    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as unknown
      const errorMessage = resolveErrorMessage(
        errorData,
        `请求失败: ${response.statusText}`
      )

      safeToast.error(errorMessage)

      throw new RequestError(errorMessage, response.status, errorData)
    }

    // 解析响应
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      const jsonData = (await response.json()) as unknown

      // 如果响应包含 code 和 data 字段（标准的后端响应格式），自动提取 data
      if (isStandardResponse(jsonData)) {
        return jsonData.data as T
      }

      return jsonData as T
    }

    return (await response.text()) as unknown as T
  } catch (error) {
    if (error instanceof RequestError) {
      throw error
    }

    const errorMessage = error instanceof Error ? error.message : '网络请求失败'

    safeToast.error(errorMessage)

    throw new RequestError(errorMessage)
  }
}

export function requestWithCurrentOrigin<
  T = unknown,
  TParams = Record<string, unknown>
>(config: RequestConfig<TParams>): Promise<T> {
  const browserBaseUrl = isBrowser ? window.location.origin : undefined
  const resolvedBaseUrl = config.baseURL ?? browserBaseUrl

  const normalizedConfig = resolvedBaseUrl
    ? { ...config, baseURL: resolvedBaseUrl }
    : config

  return request<T, TParams>(normalizedConfig)
}

/**
 * 创建绑定特定 tokenKey 的请求方法
 * - 避免在各调用方重复传递 tokenKey
 * - baseUrl: 环境变量中配置的 baseURL
 */
type CreateRequestWithTokenParams = {
  tokenKey: string
  baseUrl?: string
  serverBaseUrl?: string
}

type CreateRequestWithPrefixParams = {
  tokenKey: string
  prefix: string
  baseUrl?: string
  serverBaseUrl?: string
}

export function createRequestWithToken({
  tokenKey,
  baseUrl,
  serverBaseUrl
}: CreateRequestWithTokenParams): <
  T = unknown,
  TParams = Record<string, unknown>
>(
  config: RequestConfig<TParams>
) => Promise<T> {
  return function requestWithToken<T, TParams = Record<string, unknown>>(
    config: RequestConfig<TParams>
  ): Promise<T> {
    const resolvedBaseUrl = resolveBaseUrl({
      requestBaseUrl: config.baseURL,
      baseUrl,
      serverBaseUrl
    })

    return request<T, TParams>({
      ...config,
      tokenKey,
      baseURL: resolvedBaseUrl
    })
  }
}

export function createRequestWithPrefix({
  tokenKey,
  prefix,
  baseUrl,
  serverBaseUrl
}: CreateRequestWithPrefixParams): <
  T = unknown,
  TParams = Record<string, unknown>
>(
  config: RequestConfig<TParams>
) => Promise<T> {
  const normalizedPrefix = normalizePrefix(prefix)
  const requestWithToken = createRequestWithToken({
    tokenKey,
    baseUrl,
    serverBaseUrl
  })

  return function requestWithPrefix<T, TParams = Record<string, unknown>>(
    config: RequestConfig<TParams>
  ): Promise<T> {
    const prefixedUrl = buildPrefixedUrl({
      prefix: normalizedPrefix,
      url: config.url
    })

    return requestWithToken<T, TParams>({
      ...config,
      url: prefixedUrl
    })
  }
}

/**
 * 主业务（门户/子系统）默认请求方法，使用 app_token
 */
export const requestBusiness = createRequestWithToken({
  tokenKey: APP_TOKEN_KEY,
  baseUrl: process.env.API_GATEWAY_URL
})

/**
 * 认证中心管理员默认请求方法，使用 auth_admin_token
 */
export const requestAuthAdmin = createRequestWithPrefix({
  tokenKey: AUTH_ADMIN_TOKEN_KEY,
  prefix: '/auth',
  baseUrl: process.env.API_GATEWAY_URL
})
