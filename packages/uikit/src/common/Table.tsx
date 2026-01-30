'use client'

import React from 'react'
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'
import { Checkbox } from '../ui/checkbox'
import { Spinner } from '../ui/spinner'
import { Empty, EmptyContent, EmptyDescription, EmptyTitle, EmptyHeader, EmptyMedia } from '../ui/empty'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination'
import { Button } from '../ui/button'
import { Frame } from '../ui/frame'
import { cn } from '../lib'

// 列定义类型
export interface TableColumn<T = Record<string, unknown>> {
  title: string
  dataIndex?: keyof T | string
  key?: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  render?: (value: unknown, record: T, index: number) => React.ReactNode
  sorter?: boolean | ((a: T, b: T) => number)
  filters?: { text: string; value: unknown }[]
  onFilter?: (value: unknown, record: T) => boolean
  ellipsis?: boolean
  className?: string
}

// 表格属性类型
export interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[]
  dataSource?: T[]
  rowKey?: keyof T | ((record: T) => string)
  loading?: boolean
  bordered?: boolean
  size?: 'small' | 'medium' | 'large'
  pagination?:
    | {
        current?: number
        pageSize?: number
        total?: number
        showSizeChanger?: boolean
        showQuickJumper?: boolean
        onChange?: (page: number, pageSize: number) => void
      }
    | false
  rowSelection?: {
    type?: 'checkbox' | 'radio'
    selectedRowKeys?: React.Key[]
    onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void
    getCheckboxProps?: (record: T) => { disabled?: boolean }
  }
  onChange?: (
    pagination: unknown,
    filters: Record<string, unknown>,
    sorter: Record<string, unknown>
  ) => void
  scroll?: { x?: number | string; y?: number | string }
  className?: string
  rowClassName?: string | ((record: T, index: number) => string)
  onRow?: (
    record: T,
    index: number
  ) => React.HTMLAttributes<HTMLTableRowElement>
  locale?: {
    emptyText?: React.ReactNode
  }
}

export function Table<T = Record<string, unknown>>({
  columns,
  dataSource = [],
  rowKey,
  loading = false,
  bordered = true,
  size = 'medium',
  pagination,
  rowSelection,
  onChange,
  scroll,
  className,
  rowClassName,
  onRow,
  locale = { emptyText: '暂无数据' }
}: TableProps<T>) {
  const isFramed = bordered !== false
  const [selectedKeys, setSelectedKeys] = React.useState<React.Key[]>(
    rowSelection?.selectedRowKeys || []
  )
  const [sortState, setSortState] = React.useState<{
    column?: string
    order?: 'asc' | 'desc'
  }>({})

  // 获取行的唯一 key
  const getRowKey = (record: T, index: number): string => {
    if (!rowKey) {
      return String(index)
    }
    if (typeof rowKey === 'function') {
      return rowKey(record)
    }
    return String(record[rowKey] ?? index)
  }

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    const keys = checked
      ? dataSource.map((record, idx) => getRowKey(record, idx))
      : []
    setSelectedKeys(keys)
    rowSelection?.onChange?.(keys, checked ? dataSource : [])
  }

  // 处理单选
  const handleSelectRow = (record: T, index: number, checked: boolean) => {
    const key = getRowKey(record, index)
    const newKeys = checked
      ? [...selectedKeys, key]
      : selectedKeys.filter((k) => k !== key)
    setSelectedKeys(newKeys)
    const selectedRows = dataSource.filter((r, i) =>
      newKeys.includes(getRowKey(r, i))
    )
    rowSelection?.onChange?.(newKeys, selectedRows)
  }

  // 处理排序
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sorter) return

    let order: 'asc' | 'desc' | undefined = 'asc'
    if (sortState.column === column.key && sortState.order === 'asc') {
      order = 'desc'
    } else if (sortState.column === column.key && sortState.order === 'desc') {
      order = undefined
    }

    setSortState({ column: column.key, order })
    onChange?.(pagination, {}, { column, order })
  }

  // 获取单元格值
  const getCellValue = (record: T, column: TableColumn<T>) => {
    if (!column.dataIndex) return null
    const keys = String(column.dataIndex).split('.')
    let value: unknown = record
    for (const key of keys) {
      value = (value as Record<string, unknown>)?.[key]
    }
    return value
  }

  const isAllSelected =
    dataSource.length > 0 && selectedKeys.length === dataSource.length
  const hasData = dataSource.length > 0
  const scrollStyle =
    scroll?.y !== undefined ? { maxHeight: scroll.y } : undefined

  const paginationConfig =
    typeof pagination === 'object' && pagination ? pagination : undefined

  const currentPage = paginationConfig?.current ?? 1
  const currentPageSize = paginationConfig?.pageSize ?? 10
  const total = paginationConfig?.total ?? dataSource.length
  const totalPages = Math.max(1, Math.ceil(total / currentPageSize))
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * currentPageSize + 1
  const rangeEnd = Math.min(currentPage * currentPageSize, total)

  const pageOptions = Array.from({ length: totalPages }, (_, idx) => {
    const pageNumber = idx + 1
    const start = (pageNumber - 1) * currentPageSize + 1
    const end = Math.min(pageNumber * currentPageSize, total)
    return {
      label: `${start}-${end}`,
      value: pageNumber
    }
  })

  const handlePageChange = (page: number) => {
    if (!paginationConfig?.onChange) return
    if (page < 1 || page > totalPages || page === currentPage) return
    paginationConfig.onChange(page, currentPageSize)
  }

  // 根据 size 映射样式类
  const tableSizeClass = 
    size === 'small' ? '[&_th]:h-8 [&_th]:py-1 [&_td]:h-9 [&_td]:py-1.5 [&_th]:text-xs [&_td]:text-xs' :
    size === 'large' ? '[&_th]:h-14 [&_th]:py-4 [&_td]:h-16 [&_td]:py-4' :
    ''

  return (
    <Frame className={cn('w-full', className)}>
      <div className="relative overflow-hidden rounded-xl border border-border shadow-xs/5 bg-transparent">
        <UITable className={cn('w-full table-fixed text-sm', tableSizeClass)}>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
                {rowSelection && (
                  <TableHead>
                    {rowSelection.type !== 'radio' && (
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="全选"
                      />
                    )}
                  </TableHead>
                )}
                {columns.map((column, index) => (
                  <TableHead
                    key={column.key || String(column.dataIndex) || index}
                    className={cn(column.className)}
                    style={{ width: column.width }}
                    onClick={() => column.sorter && handleSort(column)}
                  >
                    <div>
                      {column.title}
                      {column.sorter && sortState.column === column.key && (
                        <span>{sortState.order === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (rowSelection ? 1 : 0)}
                    className="py-12"
                  >
                    <div className="flex justify-center items-center">
                      <Spinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : !hasData ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (rowSelection ? 1 : 0)}
                    className="py-12"
                  >
                    <Empty className="py-6">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M3 9h18" />
                            <path d="M9 21V9" />
                          </svg>
                        </EmptyMedia>
                        <EmptyTitle className="text-sm">{locale.emptyText}</EmptyTitle>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                dataSource.map((record, rowIndex) => {
                  const key = getRowKey(record, rowIndex)
                  const isSelected = selectedKeys.includes(key)
                  const rowClass =
                    typeof rowClassName === 'function'
                      ? rowClassName(record, rowIndex)
                      : rowClassName
                  const rowProps = onRow?.(record, rowIndex)

                  return (
                    <TableRow
                      key={key}
                      className={cn(rowClass)}
                      {...rowProps}
                    >
                      {rowSelection && (
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleSelectRow(
                                record,
                                rowIndex,
                                checked as boolean
                              )
                            }
                            disabled={
                              rowSelection.getCheckboxProps?.(record)?.disabled
                            }
                            aria-label={`选择第 ${rowIndex + 1} 行`}
                          />
                        </TableCell>
                      )}
                      {columns.map((column, colIndex) => {
                        const value = getCellValue(record, column)
                        let content: React.ReactNode = column.render
                          ? column.render(value, record, rowIndex)
                          : (value as React.ReactNode)

                        // 统一处理空值为 '-'
                        const isEmpty = (val: unknown): boolean => {
                          if (val === null || val === undefined) return true
                          if (val === '') return true
                          if (Array.isArray(val) && val.length === 0) return true
                          return false
                        }

                        if (isEmpty(content)) {
                          content = '-'
                        } else if (
                          content !== null &&
                          content !== undefined &&
                          typeof content === 'object' &&
                          !React.isValidElement(content)
                        ) {
                          // 对象类型转换为字符串
                          content =
                            Object.keys(content).length === 0
                              ? '-'
                              : JSON.stringify(content)
                        }

                        return (
                          <TableCell
                            key={
                              column.key || String(column.dataIndex) || colIndex
                            }
                            className={cn(column.className)}
                          >
                            {content}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
        </UITable>

        {pagination !== false && paginationConfig && hasData && (
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 bg-muted/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              Viewing <span className="font-medium text-foreground">{rangeStart}-{rangeEnd}</span> of {total} results
            </div>
            <Pagination className="justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className="sm:*:[svg]:hidden"
                    render={
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="h-8 text-sm"
                      >
                        Previous
                      </Button>
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className="sm:*:[svg]:hidden"
                    render={
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="h-8 text-sm"
                      >
                        Next
                      </Button>
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </Frame>
  )
}
