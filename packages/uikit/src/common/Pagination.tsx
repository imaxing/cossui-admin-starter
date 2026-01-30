'use client'

import React from 'react'
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination'

export interface PaginationProps {
  current: number
  pageSize: number
  total: number
  onChange?: (page: number, pageSize: number) => void
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  className?: string
}

export function Pagination({
  current = 1,
  pageSize = 10,
  total = 0,
  onChange,
  className
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === current) return
    onChange?.(page, pageSize)
  }

  // 计算显示的页码
  const get_page_numbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const show_ellipsis_threshold = 7

    if (totalPages <= show_ellipsis_threshold) {
      // 总页数较少，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 总页数较多，使用省略号
      pages.push(1)

      if (current <= 3) {
        // 当前页靠前
        for (let i = 2; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (current >= totalPages - 2) {
        // 当前页靠后
        pages.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // 当前页在中间
        pages.push('ellipsis')
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const page_numbers = get_page_numbers()

  return (
    <UIPagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(current - 1)
            }}
            aria-disabled={current === 1}
          />
        </PaginationItem>

        {page_numbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(page)
                }}
                isActive={current === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(current + 1)
            }}
            aria-disabled={current === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  )
}
