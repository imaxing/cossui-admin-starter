import { Skeleton } from '../ui/skeleton'
import { AppCardSkeleton } from './AppCard'

/**
 * Portal 页面骨架屏组件
 *
 * 用于 Portal 应用的整页加载状态
 * 模拟真实页面结构，包含：
 * - Header：标题 + 用户名 + 操作按钮区
 * - Main：页面标题 + 统计信息 + 卡片网格
 */

interface PortalPageSkeletonProps {
  cardCount?: number
}

export function PortalPageSkeleton({ cardCount = 8 }: PortalPageSkeletonProps) {
  return (
    <div className="min-h-screen bg-background transition-colors">
      {/* Header 骨架 */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16 border-l border-border pl-3" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-7 w-16" />
          </div>
        </div>
      </header>

      {/* Main 骨架 */}
      <main className="max-w-7xl mx-auto px-4 py-4">
        {/* 标题区域骨架 */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        {/* 卡片网格骨架 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: cardCount }).map((_, i) => (
            <AppCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  )
}
