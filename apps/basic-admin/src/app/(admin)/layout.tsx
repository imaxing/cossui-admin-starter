'use client'

import { useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import {
  Layout,
  PageTransition,
  generateBreadcrumbs,
  createNextLink,
  mapMenuItems,
  LucideIcons
} from '@cat/uikit'

const NextLink = createNextLink(Link)

// 菜单数据（icon 为 lucide-react 图标名称）
const rawMenus = [
  {
    uuid: '1',
    name: '仪表盘',
    icon: 'Layout',
    path: '/'
  },
  {
    uuid: '2',
    name: '用户管理',
    icon: 'Users',
    path: '/users'
  },
  {
    uuid: '3',
    name: '系统设置',
    icon: 'Settings',
    children: [
      {
        uuid: '3-1',
        name: '基础设置',
        path: '/settings/basic'
      },
      {
        uuid: '3-2',
        name: '安全设置',
        path: '/settings/security'
      }
    ]
  }
]

// 转换菜单数据，将 icon 字符串转为 React 元素
const menus = mapMenuItems(rawMenus)

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const breadcrumbs = useMemo(
    () => generateBreadcrumbs(pathname, menus),
    [pathname]
  )

  const LogoIcon = LucideIcons.Box

  return (
    <Layout
      logo={<LogoIcon className="h-6 w-6" />}
      menus={menus}
      active={pathname}
      open={sidebarOpen}
      onChange={setSidebarOpen}
      breadcrumbs={breadcrumbs}
      linkComponent={NextLink}
      onNavigate={(path: string) => router.push(path)}
      theme={theme as 'light' | 'dark'}
      onTheme={(newTheme) => setTheme(newTheme)}
      title="Admin"
    >
      <PageTransition pathname={pathname}>{children}</PageTransition>
    </Layout>
  )
}
