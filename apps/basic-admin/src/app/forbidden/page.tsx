'use client'

import Link from 'next/link'
import { Button } from '@koala/uikit'

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-muted-foreground">403</h1>
        <h2 className="mt-4 text-2xl font-semibold">访问被拒绝</h2>
        <p className="mt-2 text-muted-foreground">
          抱歉，您没有权限访问此页面
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button>返回首页</Button>
        </Link>
      </div>
    </div>
  )
}
