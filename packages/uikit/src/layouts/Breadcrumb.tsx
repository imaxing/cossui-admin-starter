/**
 * Layout 面包屑组件
 */

import type { BreadcrumbItem, LinkComponentProps } from './types'
import type { ComponentType } from 'react'
import { ChevronRightIcon } from './Icons'

export function DefaultBreadcrumb({
  items,
  linkComponent: LinkComponent
}: {
  items: BreadcrumbItem[]
  linkComponent?: ComponentType<LinkComponentProps>
}) {
  if (items.length === 0) return null

  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRightIcon className="h-4 w-4 text-muted-foreground/50" />}
          {item.href || item.onClick ? (
            LinkComponent && item.href ? (
              <LinkComponent
                href={item.href}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </LinkComponent>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  if (item.onClick) {
                    item.onClick()
                  } else if (item.href) {
                    window.location.href = item.href
                  }
                }}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            )
          ) : (
            <span className="font-medium text-foreground flex items-center gap-1.5">
              {item.icon}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
