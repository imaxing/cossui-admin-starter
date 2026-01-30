import { Skeleton } from '../ui/skeleton'

/**
 * 应用卡片骨架屏组件
 *
 * 用于 Portal 等应用列表页面的加载状态
 * 模拟真实 AppCard 的结构，包含：
 * - 头部：图标 + 状态徽章
 * - 内容：标题 + 描述
 * - 详细信息：4 个带图标的信息项
 */

export function AppCardSkeleton() {
  return (
    <div className="flex flex-col p-4 bg-card rounded-lg border border-border">
      {/* 头部：图标和状态 */}
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="w-9 h-9 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-sm" />
      </div>

      {/* 标题和描述 */}
      <div className="flex-1 min-w-0 space-y-2 mb-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>

      {/* 详细信息 */}
      <div className="space-y-2">
        {/* 应用代码 */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-3 h-3 rounded-sm shrink-0" />
          <Skeleton className="h-3 w-24" />
        </div>

        {/* 入口地址 */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-3 h-3 rounded-sm shrink-0" />
          <Skeleton className="h-3 w-32" />
        </div>

        {/* 菜单信息 */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-3 h-3 rounded-sm shrink-0" />
          <Skeleton className="h-3 w-28" />
        </div>

        {/* 更新时间 */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-3 h-3 rounded-sm shrink-0" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
    </div>
  )
}
