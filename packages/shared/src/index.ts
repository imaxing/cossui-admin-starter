// ==================== 浏览器兼容的共享代码 ====================
// 此包仅包含可在浏览器和 Node.js 中通用的代码

// 导出通用认证常量（方便使用）
export {
  AUTH_HEADER_KEY,
  AUTH_TOKEN_PREFIX,
  AUTH_COOKIE_CONFIG
} from '@koala/constants'

// 显式导出常用类型（避免歧义）
export type {
  // Common 类型
  PagingInfo,
  ListResponse,
  BatchDeleteParams,
  // Menu 类型
  MenuItem,
  AdminMenuItem,
  MenuPayload
} from '@koala/types'

// 导出工具函数（浏览器兼容 - 纯字符串处理）
export * from './datetime'
export * from './html'
export * from './logger'
export * from './uuid'
export * from './utils'

// Cookie 工具
export { get_cookie_domain } from './utils.cookie'

// 菜单工具
export { filterMenusByUuids } from './utils.menu'

// HTTP 请求工具
export {
  request,
  requestBusiness,
  requestAuthAdmin,
  requestWithCurrentOrigin,
  createRequestWithPrefix,
  createRequestWithToken,
  setRequestErrorHandler,
  RequestError
} from './utils.request'
export type { RequestConfig } from './utils.request'

// Next.js 路由代理工具
export { createProxyHandler } from './next.proxy'

export { createRewriteProxyHandler } from './next.proxy.rewrite'
export {
  resolveTarget,
  resolveAuthApiTarget,
  resolveWebboxApiTarget,
  resolveGuideApiTarget,
  resolveAuthApiBaseUrl,
  resolveWebboxApiBaseUrl,
  resolveGuideApiBaseUrl
} from './next.targets'
