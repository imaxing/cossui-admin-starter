'use client'

import React, { ReactNode } from 'react'
import Link from 'next/link'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '../ui/empty'
import { Button } from '../ui/button'

export interface ForbiddenProps {
  /**
   * 标题文本
   */
  title?: string
  /**
   * 主要描述信息
   */
  description?: string
  /**
   * 次要说明信息
   */
  subDescription?: string
  /**
   * 返回按钮文本
   */
  backButtonText?: string
  /**
   * 返回链接 URL
   */
  backUrl?: string
  /**
   * 是否在新窗口打开链接
   */
  openInNewTab?: boolean
  /**
   * 底部提示文本
   */
  helpText?: string
  /**
   * 自定义按钮点击事件（优先级高于 backUrl）
   */
  onBack?: () => void
  /**
   * 自定义额外的操作按钮（完全自定义按钮区域）
   */
  customActions?: ReactNode
}

/**
 * 权限受限页面组件
 */
export function Forbidden({
  title = '访问受限',
  description = '您可能没有访问该项目的权限，或登录状态已失效',
  subDescription = '请返回门户导航重新登录，或联系管理员分配项目权限',
  backButtonText = '返回门户登录',
  backUrl = '/',
  openInNewTab = false,
  helpText = '如有疑问，请联系系统管理员',
  onBack,
  customActions
}: ForbiddenProps = {}) {
  const handleBack = () => {
    if (onBack) {
      onBack()
    }
  }

  const buttonContent = (
    <Button variant="default" onClick={onBack ? handleBack : undefined}>
      <ArrowLeft />
      {backButtonText}
    </Button>
  )

  return (
    <Empty className='h-screen'>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShieldAlert />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription className="text-xs text-neutral-600 dark:text-neutral-400">{description}</EmptyDescription>
        {subDescription && <EmptyDescription className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">{subDescription}</EmptyDescription>}
      </EmptyHeader>
      {customActions && (
        <EmptyContent>
          {customActions}
        </EmptyContent>
      )}
    </Empty>
  )
}
