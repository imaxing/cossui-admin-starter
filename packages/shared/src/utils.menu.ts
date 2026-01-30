import type { MenuItem } from '@koala/types/admin'

/**
 * 根据 UUID 列表过滤菜单（递归处理子菜单）
 *
 * @param menus - 完整的菜单列表
 * @param uuids - 允许显示的菜单 UUID 列表
 * @returns 过滤后的菜单列表
 *
 * @example
 * const allMenus = [
 *   { uuid: 'menu-1', name: '菜单1', path: '/menu1' },
 *   { uuid: 'menu-2', name: '菜单2', children: [
 *     { uuid: 'menu-2-1', name: '子菜单1', path: '/menu2/sub1' }
 *   ]}
 * ]
 *
 * const filtered = filterMenusByUuids({
 *   menus: allMenus,
 *   uuids: ['menu-1', 'menu-2', 'menu-2-1']
 * })
 */
export function filterMenusByUuids({
  menus,
  uuids
}: {
  menus: MenuItem[]
  uuids: string[]
}): MenuItem[] {
  if (!menus || menus.length === 0) {
    return []
  }

  // 如果 uuids 为空，说明用户没有任何菜单权限，返回空数组
  if (!uuids || uuids.length === 0) {
    return []
  }

  return menus
    .filter((menu) => uuids.includes(menu.uuid))
    .map((menu) => {
      if (menu.children && menu.children.length > 0) {
        const filteredChildren = filterMenusByUuids({
          menus: menu.children,
          uuids
        })

        return {
          ...menu,
          children: filteredChildren.length > 0 ? filteredChildren : undefined
        }
      }
      return menu
    })
}
