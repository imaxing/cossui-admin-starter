import { ReactNode, ComponentType } from 'react'

/**
 * Layout menu item
 */
export interface MenuItem {
  name: string
  path?: string
  icon?: ReactNode
  children?: MenuItem[]
}

/**
 * Layout breadcrumb item
 */
export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: ReactNode
  onClick?: () => void
}

/**
 * Link component props
 */
export interface LinkComponentProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

/**
 * Layout component props
 */
export interface LayoutProps {
  collapsed?: number
  expanded?: number
  height?: number
  className?: string
  contentClassName?: string
  loading?: boolean
  logo?: ReactNode
  breadcrumbs?: BreadcrumbItem[]
  menus: MenuItem[]
  active?: string
  open?: boolean
  onChange?: (open: boolean) => void
  version?: string
  breadRender?: (items: BreadcrumbItem[]) => ReactNode
  itemRender?: (item: MenuItem, open: boolean, active: boolean) => ReactNode
  onMenuItemClick?: (item: MenuItem, e: React.MouseEvent) => void
  onNavigate?: (path: string) => void
  linkComponent?: ComponentType<LinkComponentProps>
  title?: string | ReactNode
  onLogout?: () => void
  theme?: 'light' | 'dark'
  onTheme?: (theme: 'light' | 'dark') => void
  children: ReactNode
}

/**
 * Icon component props
 */
export interface IconProps {
  className?: string
  style?: React.CSSProperties
}

/**
 * PageTransition component props
 */
export interface PageTransitionProps {
  /** 路径变化触发动画 */
  pathname?: string
  /** 子元素 */
  children: ReactNode
}
