/**
 * 菜单相关类型
 */

/**
 * 菜单项
 */
export interface MenuItem {
  uuid: string
  name: string
  icon?: string
  path?: string
  children?: MenuItem[]
  new?: boolean
  pro?: boolean
}

/**
 * 管理后台菜单项别名
 */
export type AdminMenuItem = MenuItem

/**
 * 菜单数据载荷
 */
export interface MenuPayload {
  items: MenuItem[]
}
