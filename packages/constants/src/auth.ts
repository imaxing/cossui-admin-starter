/**
 * 鉴权相关常量
 */

/**
 * Auth Admin Token Cookie 名称（认证中心管理后台专用）
 */
export const AUTH_ADMIN_TOKEN_KEY = 'auth_admin_token'

/**
 * App Token Cookie 名称
 * portal 作为登录入口使用，各子应用共享此 token
 */
export const APP_TOKEN_KEY = 'app_token'

/**
 * Token Header 名称
 */
export const AUTH_HEADER_KEY = 'Authorization'

/**
 * Token 前缀
 */
export const AUTH_TOKEN_PREFIX = 'Bearer'

/**
 * Cookie 配置（基础配置，不包含 domain，需在使用时指定）
 */
export const AUTH_COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
  path: '/'
}

/**
 * 用户配置校验接口路径（附加在 /auth 前缀后使用）
 */
export const AUTH_CHECK_API = '/check'
