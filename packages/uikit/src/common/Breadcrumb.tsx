'use client'

import React from 'react'
import {
  Breadcrumb as CossBreadcrumb,
  BreadcrumbEllipsis as CossBreadcrumbEllipsis,
  BreadcrumbItem as CossBreadcrumbItem,
  BreadcrumbLink as CossBreadcrumbLink,
  BreadcrumbList as CossBreadcrumbList,
  BreadcrumbPage as CossBreadcrumbPage,
  BreadcrumbSeparator as CossBreadcrumbSeparator
} from '../ui/breadcrumb'

/**
 * Breadcrumb Item 配置
 */
export interface BreadcrumbItem {
  label: React.ReactNode
  href?: string
  icon?: React.ReactNode
  className?: string
}

/**
 * Breadcrumb Props
 */
export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
  maxItems?: number // 最大显示项数,超出显示省略号
}

/**
 * Breadcrumb 组件
 *
 * 封装 shadcn Breadcrumb,提供更简洁的 API
 * 业务代码应该使用此组件而非直接使用 shadcn 组件
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: '首页', href: '/', icon: <HomeIcon /> },
 *     { label: '用户管理', href: '/users' },
 *     { label: '用户详情' }
 *   ]}
 * />
 * ```
 */
export function Breadcrumb({
  items,
  separator,
  className,
  maxItems
}: BreadcrumbProps) {
  // 处理省略显示
  const displayItems = React.useMemo((): (
    | BreadcrumbItem
    | { label: string; isEllipsis: boolean }
  )[] => {
    if (!maxItems || items.length <= maxItems) {
      return items
    }

    // 保留第一项和最后 (maxItems - 1) 项
    const first = items[0]
    const lastItems = items.slice(-(maxItems - 1))

    return [first, { label: '...', isEllipsis: true } as const, ...lastItems]
  }, [items, maxItems])

  return (
    <CossBreadcrumb className={className}>
      <CossBreadcrumbList>
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1
          const isEllipsis = 'isEllipsis' in item && item.isEllipsis

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <CossBreadcrumbSeparator>
                  {separator}
                </CossBreadcrumbSeparator>
              )}

              <CossBreadcrumbItem>
                {isEllipsis ? (
                  <CossBreadcrumbEllipsis />
                ) : isLast ? (
                  <CossBreadcrumbPage
                    className={'className' in item ? item.className : undefined}
                  >
                    {'icon' in item && item.icon}
                    {item.label}
                  </CossBreadcrumbPage>
                ) : (
                  <CossBreadcrumbLink
                    href={'href' in item ? item.href : '#'}
                    className={'className' in item ? item.className : undefined}
                  >
                    {'icon' in item && item.icon}
                    {item.label}
                  </CossBreadcrumbLink>
                )}
              </CossBreadcrumbItem>
            </React.Fragment>
          )
        })}
      </CossBreadcrumbList>
    </CossBreadcrumb>
  )
}

/**
 * 高级 Breadcrumb 组件 - 提供原始 shadcn 子组件访问
 *
 * 用于需要完全自定义布局的场景
 *
 * @example
 * ```tsx
 * <BreadcrumbAdvanced.Root>
 *   <BreadcrumbAdvanced.List>
 *     <BreadcrumbAdvanced.Item>
 *       <BreadcrumbAdvanced.Link href="/">首页</BreadcrumbAdvanced.Link>
 *     </BreadcrumbAdvanced.Item>
 *     <BreadcrumbAdvanced.Separator />
 *     <BreadcrumbAdvanced.Item>
 *       <BreadcrumbAdvanced.Page>当前页</BreadcrumbAdvanced.Page>
 *     </BreadcrumbAdvanced.Item>
 *   </BreadcrumbAdvanced.List>
 * </BreadcrumbAdvanced.Root>
 * ```
 */
export const BreadcrumbAdvanced = {
  Root: CossBreadcrumb,
  List: CossBreadcrumbList,
  Item: CossBreadcrumbItem,
  Link: CossBreadcrumbLink,
  Page: CossBreadcrumbPage,
  Separator: CossBreadcrumbSeparator,
  Ellipsis: CossBreadcrumbEllipsis
}
