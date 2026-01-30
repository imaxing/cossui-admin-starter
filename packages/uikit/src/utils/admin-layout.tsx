import * as LucideIcons from 'lucide-react'
import type {
  MenuItem,
  BreadcrumbItem,
  LinkComponentProps
} from '../layouts/types'

/**
 * 图标映射函数
 */
export function getIcon(iconName?: string) {
  if (!iconName) return undefined

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Home: LucideIcons.Home,
    Users: LucideIcons.Users,
    Shield: LucideIcons.Shield,
    Lock: LucideIcons.Lock,
    FolderKanban: LucideIcons.FolderKanban,
    Link: LucideIcons.Link,
    Menu: LucideIcons.Menu,
    Settings: LucideIcons.Settings,
    Globe: LucideIcons.Globe,
    FileText: LucideIcons.FileText,
    Database: LucideIcons.Database,
    Layout: LucideIcons.Layout,
    LayoutDashboard: LucideIcons.LayoutDashboard,
    Layers: LucideIcons.Layers,
    Package: LucideIcons.Package,
    Box: LucideIcons.Box,
    KeyRound: LucideIcons.KeyRound,
    // 更多常用图标
    User: LucideIcons.User,
    UserCog: LucideIcons.UserCog,
    Cog: LucideIcons.Cog,
    Bell: LucideIcons.Bell,
    Mail: LucideIcons.Mail,
    Calendar: LucideIcons.Calendar,
    Folder: LucideIcons.Folder,
    File: LucideIcons.File,
    Image: LucideIcons.Image,
    Video: LucideIcons.Video,
    Music: LucideIcons.Music,
    ShoppingCart: LucideIcons.ShoppingCart,
    CreditCard: LucideIcons.CreditCard,
    DollarSign: LucideIcons.DollarSign,
    BarChart: LucideIcons.BarChart,
    PieChart: LucideIcons.PieChart,
    Activity: LucideIcons.Activity,
    Zap: LucideIcons.Zap,
    Star: LucideIcons.Star,
    Heart: LucideIcons.Heart,
    MessageSquare: LucideIcons.MessageSquare,
    HelpCircle: LucideIcons.HelpCircle,
    Info: LucideIcons.Info,
    AlertCircle: LucideIcons.AlertCircle
  }

  const Icon = iconMap[iconName] || LucideIcons.Circle
  return <Icon className="h-4 w-4" />
}

/**
 * 原始菜单项类型（来自 API）
 */
export interface RawMenuItem {
  uuid?: string
  name: string
  path?: string
  icon?: string
  children?: RawMenuItem[]
}

/**
 * 将 MenuItem 类型映射为 cat 的 MenuItem 类型
 */
export function mapMenuItems(items: RawMenuItem[]): MenuItem[] {
  return items.map((item) => ({
    name: item.name,
    ...(item.path && { path: item.path }),
    icon: getIcon(item.icon),
    children: item.children ? mapMenuItems(item.children) : undefined
  }))
}

/**
 * 根据路径生成面包屑
 */
export function generateBreadcrumbs(
  pathname: string,
  menus: MenuItem[]
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: '首页',
      href: '/',
      icon: <LucideIcons.Home className="h-3.5 w-3.5" />
    }
  ]

  // 查找当前路径对应的菜单项
  const findMenuItem = (items: MenuItem[], path: string): MenuItem | null => {
    for (const item of items) {
      if (item.path === path) return item
      if (item.children) {
        const found = findMenuItem(item.children, path)
        if (found) return found
      }
    }
    return null
  }

  if (pathname !== '/') {
    const menuItem = findMenuItem(menus, pathname)
    if (menuItem) {
      breadcrumbs.push({
        label: menuItem.name,
        icon: menuItem.icon
      })
    } else {
      // 如果没有找到菜单项，根据路径生成
      const segments = pathname.split('/').filter(Boolean)
      segments.forEach((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/')
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: index < segments.length - 1 ? path : undefined
        })
      })
    }
  }

  return breadcrumbs
}

/**
 * Next.js Link 组件类型
 */
type NextLinkType = React.ComponentType<{
  href: string
  className?: string
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
  children?: React.ReactNode
}>

/**
 * Next.js Link 组件适配器工厂函数
 */
export function createNextLink(Link: NextLinkType) {
  return function NextLink({
    href,
    children,
    className,
    onClick
  }: LinkComponentProps) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    )
  }
}
