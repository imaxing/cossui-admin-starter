import { useState, useEffect } from 'react'
import type { LayoutProps, MenuItem } from './types'
import { DEFAULT_SIZE, SIDEBAR_EXPANDED } from './config'
import { LogoutIcon } from './Icons'
import { DefaultBreadcrumb } from './Breadcrumb'
import { MenuItemWrapper } from './MenuItem'
import { ThemeToggle } from './ThemeToggle'
import { AsideSkeleton } from '../skeletons'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'

export type {
  LayoutProps,
  MenuItem,
  BreadcrumbItem,
  LinkComponentProps
} from './types'

export default function Layout({
  collapsed = DEFAULT_SIZE,
  expanded = SIDEBAR_EXPANDED,
  height = DEFAULT_SIZE,
  className = '',
  contentClassName = '',
  loading = false,
  logo,
  breadcrumbs = [],
  menus,
  active,
  open = false,
  onChange,
  version,
  breadRender,
  itemRender,
  onMenuItemClick,
  onNavigate,
  linkComponent,
  title,
  onLogout,
  theme,
  onTheme,
  children
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(open)
  const [expandedMenu, setExpandedMenu] = useState<string>('')
  const effectiveOpen = sidebarOpen

  useEffect(() => {
    setSidebarOpen(open)
  }, [open])

  const handleSidebarOpenChange = (next: boolean) => {
    setSidebarOpen(next)
    onChange?.(next)
  }

  const handleToggleExpand = (menuName: string) => {
    setExpandedMenu((prev) => (prev === menuName ? '' : menuName))
  }

  const isMenuActive = (item: MenuItem) => {
    if (!active) return false
    if (item.path === active) return true
    if (item.name === active) return true
    return false
  }

  // 当 active 变化时，找到包含当前 active 的菜单并展开
  useEffect(() => {
    if (!active) return

    const findParentMenu = (items: MenuItem[]): string | null => {
      for (const item of items) {
        if (item.children) {
          const hasActive = item.children.some(
            (child) => child.path === active || child.name === active
          )
          if (hasActive) return item.name
        }
      }
      return null
    }

    const parentMenu = findParentMenu(menus)
    if (parentMenu && parentMenu !== expandedMenu) {
      setExpandedMenu(parentMenu)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return (
    <SidebarProvider
      open={effectiveOpen}
      onOpenChange={handleSidebarOpenChange}
    >
      <div className={`flex h-screen w-full bg-background ${className}`}>
        {/* 侧边栏 */}
        <aside
          className="sticky top-0 h-screen flex flex-col overflow-hidden border-r flex-shrink-0 bg-sidebar text-sidebar-foreground"
          style={{
            width: effectiveOpen ? `${expanded}px` : `${collapsed}px`,
            borderColor: 'var(--sidebar-border)',
            transition: 'width 0.28s cubic-bezier(0.22, 0.67, 0.38, 0.95)'
          }}
        >
          {/* Logo */}
          <div
            className="flex items-center justify-center px-4 border-b shrink-0"
            style={{
              height: `${height}px`,
              borderColor: 'var(--sidebar-border)'
            }}
          >
            {logo}
          </div>

          {/* 菜单 */}
          <div className="flex-1 overflow-auto px-[11px] py-3">
            {loading || menus.length === 0 ? (
              <AsideSkeleton />
            ) : (
              <nav className="space-y-px">
                {menus.map((item, index) => {
                  const isActive = isMenuActive(item)
                  return (
                    <MenuItemWrapper
                      key={index}
                      item={item}
                      open={effectiveOpen}
                      active={isActive}
                      activePath={active}
                      itemRender={itemRender}
                      onMenuItemClick={onMenuItemClick}
                      onNavigate={onNavigate}
                      expandedMenu={expandedMenu}
                      onToggleExpand={handleToggleExpand}
                    />
                  )
                })}
              </nav>
            )}
          </div>

          {/* 版本信息 */}
          {version && effectiveOpen && (
            <div
              className="px-4 py-3 border-t text-center text-xs text-sidebar-foreground/64"
              style={{ borderColor: 'var(--sidebar-border)' }}
            >
              v{version}
            </div>
          )}

          {/* 侧边栏展开/收起按钮 */}
          <div
            className="px-[11px] py-3 border-t"
            style={{ borderColor: 'var(--sidebar-border)' }}
          >
            <SidebarTrigger className="w-full hover:bg-accent hover:text-accent-foreground transition-colors" />
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex flex-col overflow-hidden flex-1 min-w-0 w-full transition-[margin] duration-300 ease-[cubic-bezier(0.22,0.67,0.38,0.95)]">
          {/* 头部 */}
          <header className="bg-card shrink-0">
            <div
              className="px-3 flex items-center justify-between border-b"
              style={{
                height: `${height}px`,
                borderColor: 'var(--border)'
              }}
            >
              {/* 左侧：面包屑 */}
              <div className="flex items-center gap-2">
                {breadRender ? (
                  breadRender(breadcrumbs)
                ) : (
                  <DefaultBreadcrumb
                    items={breadcrumbs}
                    linkComponent={linkComponent}
                  />
                )}
              </div>

              {/* 右侧：主题切换 + 用户信息 */}
              <div className="flex items-center gap-2">
                <ThemeToggle theme={theme} onTheme={onTheme} />

                {title && onLogout && (
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {typeof title === 'string' ? (
                      <>
                        <span>{title}</span>
                        <LogoutIcon />
                      </>
                    ) : (
                      title
                    )}
                  </button>
                )}

                {title && !onLogout && (
                  <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground">
                    {typeof title === 'string' ? <span>{title}</span> : title}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* 内容区域 */}
          <div className={`flex-1 overflow-auto p-3 ${contentClassName}`}>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
