/**
 * Cookie 配置工具
 */


const PRODUCTION_DOMAIN = '.kxmeet.com'
/**
 * 获取 Cookie Domain 配置
 *
 * 配置逻辑：
 * - 根据请求 Host 判断是否需要设置 domain
 * - localhost/127.0.0.1 返回 undefined（浏览器使用 host-only）
 *
 * 使用场景：
 * - 本地开发：host=localhost → undefined（自动使用 localhost）
 * - Docker 本地测试：host=localhost → undefined（自动使用 localhost）
 * - 线上生产：host=*.kxmeet.com → .kxmeet.com（跨子域共享 cookie）
 */
export function get_cookie_domain(host?: string): string | undefined {
  const normalized_host = host?.trim().toLowerCase()

  if (!normalized_host) return undefined

  const host_without_port = normalized_host.split(':')[0]

  if (!host_without_port) return undefined
  if (host_without_port === 'localhost' || host_without_port === '127.0.0.1') {
    return undefined
  }

  if (host_without_port === 'kxmeet.com') return PRODUCTION_DOMAIN
  if (host_without_port.endsWith(PRODUCTION_DOMAIN)) return PRODUCTION_DOMAIN

  return undefined
}
