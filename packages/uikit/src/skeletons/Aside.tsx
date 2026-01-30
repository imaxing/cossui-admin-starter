import { Skeleton } from '../ui/skeleton'
import type { AsideSkeletonProps } from './types'

/**
 * 侧边栏菜单骨架屏组件
 */
export function AsideSkeleton({ count = 6 }: AsideSkeletonProps) {
  return (
    <div className="space-y-2">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className="h-9 rounded-md" />
      ))}
    </div>
  )
}
