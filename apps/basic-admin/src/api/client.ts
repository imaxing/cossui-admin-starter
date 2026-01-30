import { createRequestWithPrefix } from '@koala/shared'

/**
 * API 请求封装
 * 统一配置请求前缀和基础 URL
 */
export const request = createRequestWithPrefix({
  prefix: '/api',
  baseUrl: process.env.API_BASE_URL || ''
})

export default request
