/**
 * Layout 菜单项组件
 */

import type React from 'react'
import { useEffect } from 'react'
import type { MenuItem } from './types'
import { ChevronDownIcon } from './Icons'
import {
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton
} from '../ui/sidebar'

/**
 * 检查菜单项或其子项是否激活
 */
export function hasActiveChild(item: MenuItem, activePath?: string): boolean {
  if (!activePath) return false
  if (item.path === activePath || item.name === activePath) return true
  if (item.children) {
    return item.children.some((child) => hasActiveChild(child, activePath))
  }
  return false
}

/**
 * 默认菜单项内容渲染（仅渲染图标和文字，不包括箭头）
 */
export function DefaultMenuItemContent({
  item,
  open,
  active
}: {
  item: MenuItem
  open: boolean
  active?: boolean
}) {
  return (
    <>
      {item.icon && (
        <div
          className={`shrink-0 flex items-center  justify-center transition-colors ${
            open ? 'h-4 w-4' : 'h-5 w-5'
          } ${active ? 'opacity-100' : 'opacity-50'}`}
        >
          {item.icon}
        </div>
      )}
      {open && (
        <span className="flex-1 text-left text-sm whitespace-nowrap">
          {item.name}
        </span>
      )}
    </>
  )
}

/**
 * 通用菜单项渲染器（处理嵌套逻辑）
 */
export function MenuItemWrapper({
  item,
  open,
  active,
  activePath,
  level = 0,
  itemRender,
  onMenuItemClick,
  onNavigate,
  expandedMenu,
  onToggleExpand
}: {
  item: MenuItem
  open: boolean
  active: boolean
  activePath?: string
  level?: number
  itemRender?: (
    item: MenuItem,
    open: boolean,
    active: boolean
  ) => React.ReactNode
  onMenuItemClick?: (item: MenuItem, e: React.MouseEvent) => void
  onNavigate?: (path: string) => void
  expandedMenu?: string
  onToggleExpand?: (menuName: string) => void
}) {
  const hasChildren = item.children && item.children.length > 0
  const hasActiveDescendant = hasChildren && hasActiveChild(item, activePath)
  const expanded = expandedMenu === item.name

  useEffect(() => {
    if (hasActiveDescendant && open && onToggleExpand && !expanded) {
      onToggleExpand(item.name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasActiveDescendant, open, item.name])

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault()
      if (onToggleExpand) {
        onToggleExpand(item.name)
      }
    } else if (item.path) {
      e.preventDefault()
      if (onMenuItemClick) {
        onMenuItemClick(item, e)
      } else if (onNavigate) {
        onNavigate(item.path)
      }
    }
  }

  const isActive = active || hasActiveDescendant

  return (
    <div>
      {/* 菜单项内容 */}
      <SidebarMenuButton
        type="button"
        onClick={handleClick}
        isActive={isActive}
        className={[
          'group w-full text-[#545454] dark:text-[#FAFAFA] rounded-lg transition-colors duration-150',
          open
            ? 'justify-between px-3 py-0 min-h-[34px] gap-2.5'
            : 'justify-center px-2 py-0 min-h-[34px] gap-0',
          isActive
            ? open
              ? 'bg-menu-active text-menu-active-foreground'
              : 'text-menu-active-foreground'
            : 'hover:bg-menu-active'
        ].join(' ')}
      >
        {itemRender ? (
          itemRender(item, open, active)
        ) : (
          <DefaultMenuItemContent item={item} open={open} active={isActive} />
        )}
        {/* 箭头自动显示 */}
        {hasChildren && open && (
          <ChevronDownIcon
            className={`h-3.5 w-3.5 shrink-0 transition-all duration-200 ease-in-out ${
              isActive
                ? 'text-sidebar-foreground/64'
                : 'text-sidebar-foreground/48 group-hover:text-sidebar-foreground/64'
            }`}
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        )}
      </SidebarMenuButton>

      {/* 子菜单 - 平滑动画 */}
      {hasChildren && open && (
        <div
          style={{
            display: 'grid',
            gridTemplateRows: expanded ? '1fr' : '0fr',
            transition: 'grid-template-rows 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden'
          }}
        >
          <div style={{ minHeight: 0 }}>
            <SidebarMenuSub className="mt-px space-y-px pl-7 relative">
              {/* Cloudflare 风格连接线 */}
              <div className="absolute left-[19px] inset-y-px w-px bg-neutral-200 dark:bg-neutral-800 z-10"></div>
              {item.children!.map((child, index) => {
                const childActive =
                  child.path === activePath || child.name === activePath
                return (
                  <SidebarMenuSubButton
                    key={index}
                    onClick={(e) => {
                      if (child.path) {
                        e.preventDefault()
                        if (onMenuItemClick) {
                          onMenuItemClick(child, e)
                        } else if (onNavigate) {
                          onNavigate(child.path)
                        }
                      }
                    }}
                    isActive={childActive}
                    className={`rounded-lg px-[11px] py-0 min-h-[34px] transition-colors ${
                      childActive
                        ? 'bg-menu-active text-menu-active-foreground'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-menu-active'
                    }`}
                  >
                    {itemRender ? (
                      itemRender(child, open, childActive)
                    ) : (
                      <span className="flex-1 whitespace-nowrap text-sm font-medium">
                        {child.name}
                      </span>
                    )}
                  </SidebarMenuSubButton>
                )
              })}
            </SidebarMenuSub>
          </div>
        </div>
      )}
    </div>
  )
}
