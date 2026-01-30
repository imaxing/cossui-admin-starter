'use client'

import { Skeleton } from '../ui/skeleton'
import type { LayoutSkeletonProps } from './types'
import { SIDEBAR_EXPANDED, DEFAULT_SIZE } from '../layouts/config'

/**
 * 布局加载骨架屏
 *
 * 模拟真实布局结构，包含：
 * - 收起状态的侧边栏（logo + 菜单项图标）
 * - 顶部导航栏（面包屑 + 右侧操作区）
 * - 主内容区域（表格/卡片骨架）
 */
export function LayoutSkeleton({
  size = SIDEBAR_EXPANDED,
  height = DEFAULT_SIZE
}: LayoutSkeletonProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* 侧边栏骨架 - 固定定位，收起状态 */}
      <aside
        className="fixed left-0 top-0 h-screen border-r bg-card"
        style={{ width: `${size}px` }}
      >
        {/* Logo 区域 */}
        <div
          className="flex items-center justify-center border-b"
          style={{ height: `${height}px` }}
        >
          <Skeleton className="h-5 w-5 rounded" />
        </div>

        {/* 菜单项骨架 */}
        <div className="px-3 py-4 space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-9 rounded-md" />
          ))}
        </div>
      </aside>

      {/* 主内容区 - 固定左边距 */}
      <main
        className="flex flex-col overflow-hidden w-full"
        style={{ marginLeft: `${size}px` }}
      >
        {/* 顶部导航栏骨架 */}
        <header className="bg-card shrink-0">
          <div
            className="px-3 flex items-center justify-between border-b"
            style={{ height: `${height}px` }}
          >
            {/* 左侧：面包屑骨架 */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-1" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* 右侧：操作按钮骨架 */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </header>

        {/* 内容区域骨架 */}
        <div className="flex-grow overflow-hidden p-3">
          <div className="space-y-4">
            {/* 页面标题 + 操作按钮 */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>

            {/* 搜索栏 / 筛选器 */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 flex-1 rounded-md" />
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>

            {/* 表格骨架 */}
            <div className="rounded-lg border bg-card overflow-hidden">
              {/* 表头 */}
              <div className="border-b bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-40" />
                  <div className="flex-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>

              {/* 表格行 */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="border-b px-4 py-3 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-40" />
                    <div className="flex-1" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6" />
                      <Skeleton className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页骨架 */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
