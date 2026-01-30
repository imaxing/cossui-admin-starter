'use client'

import React from 'react'
import {
  Card as CossCard,
  CardHeader as CossCardHeader,
  CardFooter as CossCardFooter,
  CardTitle as CossCardTitle,
  CardDescription as CossCardDescription,
  CardContent as CossCardContent
} from '../ui/card'
import { cn } from '../lib'

/**
 * Card Props
 */
export interface CardProps extends React.ComponentPropsWithoutRef<
  typeof CossCard
> {}

/**
 * Card 组件
 *
 * 封装 shadcn Card
 *
 * @example
 * ```tsx
 * <Card>
 *   <Card.Header>
 *     <Card.Title>标题</Card.Title>
 *     <Card.Description>描述</Card.Description>
 *   </Card.Header>
 *   <Card.Content>内容</Card.Content>
 *   <Card.Footer>底部</Card.Footer>
 * </Card>
 * ```
 */
export function Card({ className, ...props }: CardProps) {
  return <CossCard className={cn(className)} {...props} />
}

Card.Header = CossCardHeader
Card.Footer = CossCardFooter
Card.Title = CossCardTitle
Card.Description = CossCardDescription
Card.Content = CossCardContent

// 单独导出
export const CardHeader = CossCardHeader
export const CardFooter = CossCardFooter
export const CardTitle = CossCardTitle
export const CardDescription = CossCardDescription
export const CardContent = CossCardContent
