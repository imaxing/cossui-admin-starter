'use client'

import { useEffect, useState } from 'react'
import type { PageTransitionProps } from './types'

export type { PageTransitionProps } from './types'

/**
 * 页面过渡动画组件
 *
 * 在路径变化时提供淡入淡出 + 轻微上移的过渡效果
 */
export default function PageTransition({ pathname, children }: PageTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (!pathname) return

    // 路由变化时触发过渡动画
    setIsTransitioning(true)

    // 短暂延迟后移除过渡状态，让淡入动画生效
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 50)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div
      className={`h-full transition-all duration-300 ease-out ${
        isTransitioning
          ? 'opacity-0 translate-y-2'
          : 'opacity-100 translate-y-0'
      }`}
    >
      {children}
    </div>
  )
}
