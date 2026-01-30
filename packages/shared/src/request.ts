import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export interface RequestConfig extends AxiosRequestConfig {
  /** 是否显示错误提示 */
  showError?: boolean
}

export interface RequestInstance extends AxiosInstance {
  <T>(config: RequestConfig): Promise<T>
  <T>(url: string, config?: RequestConfig): Promise<T>
}

export interface CreateRequestOptions {
  /** 基础 URL */
  baseURL?: string
  /** 超时时间（毫秒） */
  timeout?: number
  /** 请求拦截器 */
  onRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  /** 响应拦截器 */
  onResponse?: <T>(response: AxiosResponse<T>) => T
  /** 错误处理 */
  onError?: (error: Error) => void
}

/**
 * 创建 axios 请求实例
 * @param options 配置选项
 * @returns axios 实例
 *
 * @example
 * const request = createRequest({
 *   baseURL: '/api',
 *   timeout: 10000,
 *   onRequest: (config) => {
 *     config.headers.Authorization = `Bearer ${token}`
 *     return config
 *   },
 *   onResponse: (response) => response.data,
 *   onError: (error) => console.error(error)
 * })
 *
 * // 使用
 * const data = await request<UserList>({ url: '/users', method: 'GET' })
 */
export default function createRequest(options: CreateRequestOptions = {}): RequestInstance {
  const {
    baseURL = '',
    timeout = 10000,
    onRequest,
    onResponse,
    onError
  } = options

  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      if (onRequest) {
        return onRequest(config)
      }
      return config
    },
    (error) => {
      if (onError) {
        onError(error)
      }
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      if (onResponse) {
        return onResponse(response)
      }
      return response.data
    },
    (error) => {
      if (onError) {
        onError(error)
      }
      return Promise.reject(error)
    }
  )

  return instance as RequestInstance
}
