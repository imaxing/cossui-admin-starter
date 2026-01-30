'use client'

import { useMemo, useState } from 'react'
import { Button } from './Button'
import { Card } from './Card'
import { Checkbox } from './Checkbox'
import { Input } from './Input'
import { CheckSquare, Search, Square } from '../icons'
import { cn } from '../lib'

export interface TreeSelectorOption {
  id: string
  label: string
  children?: TreeSelectorOption[]
}

export interface TreeSelectorProps {
  options: TreeSelectorOption[]
  value: string[]
  onChange: (ids: string[]) => void
  loading?: boolean
  error?: string
  enableFilter?: boolean
  showSelectedList?: boolean
}

const collectAllIds = (options: TreeSelectorOption[], ids: string[]) => {
  options.forEach((item) => {
    ids.push(item.id)
    if (item.children) {
      collectAllIds(item.children, ids)
    }
  })
}

const collectSelectedItems = (
  options: TreeSelectorOption[],
  selected: Set<string>,
  result: TreeSelectorOption[]
) => {
  options.forEach((item) => {
    if (selected.has(item.id)) {
      result.push(item)
    }
    if (item.children) {
      collectSelectedItems(item.children, selected, result)
    }
  })
}

const toggleItemWithChildren = (
  item: TreeSelectorOption,
  checked: boolean,
  selected: Set<string>
) => {
  if (checked) {
    selected.add(item.id)
  } else {
    selected.delete(item.id)
  }
  if (item.children) {
    item.children.forEach((child) =>
      toggleItemWithChildren(child, checked, selected)
    )
  }
}

const filterTreeOptions = (
  options: TreeSelectorOption[],
  keyword: string
): TreeSelectorOption[] => {
  if (!keyword) return options
  const lower = keyword.toLowerCase()
  const matches = (label: string) => label.toLowerCase().includes(lower)

  const result: TreeSelectorOption[] = []

  options.forEach((item) => {
    const nextChildren = item.children
      ? filterTreeOptions(item.children, keyword)
      : undefined
    if (matches(item.label) || (nextChildren && nextChildren.length > 0)) {
      result.push({ ...item, children: nextChildren })
    }
  })

  return result
}

export default function TreeSelector({
  options,
  value,
  onChange,
  loading = false,
  error,
  enableFilter = true,
  showSelectedList = true
}: TreeSelectorProps) {
  const [filter, setFilter] = useState('')
  const selectedSet = useMemo(() => new Set(value), [value])
  const filteredOptions = useMemo(
    () => filterTreeOptions(options, filter.trim()),
    [options, filter]
  )
  const allIds = useMemo(() => {
    const ids: string[] = []
    collectAllIds(options, ids)
    return ids
  }, [options])

  const selectedCount = useMemo(() => {
    const result: TreeSelectorOption[] = []
    collectSelectedItems(options, selectedSet, result)
    return result.length
  }, [options, selectedSet])
  const selectedOptions = useMemo(() => {
    const result: TreeSelectorOption[] = []
    collectSelectedItems(options, selectedSet, result)
    return result
  }, [options, selectedSet])

  const targetOptions =
    enableFilter && filter.trim() ? filteredOptions : options
  const targetIds = useMemo(() => {
    const ids: string[] = []
    collectAllIds(targetOptions, ids)
    return ids
  }, [targetOptions])
  const allTargetSelected =
    targetIds.length > 0 && targetIds.every((id) => selectedSet.has(id))

  const emitChange = (nextSelected: Set<string>) => {
    const nextIds = allIds.filter((id) => nextSelected.has(id))
    onChange(nextIds)
  }

  const handleToggleAll = () => {
    const nextSelected = new Set<string>(selectedSet)
    if (allTargetSelected) {
      targetIds.forEach((id) => nextSelected.delete(id))
    } else {
      targetIds.forEach((id) => nextSelected.add(id))
    }
    emitChange(nextSelected)
  }

  const handleToggleItem = (item: TreeSelectorOption) => {
    const nextSelected = new Set(selectedSet)
    const checked = !selectedSet.has(item.id)
    toggleItemWithChildren(item, checked, nextSelected)
    emitChange(nextSelected)
  }

  const renderItem = (item: TreeSelectorOption, level = 0) => {
    const checked = selectedSet.has(item.id)
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.id} className="space-y-0.5">
        <div
          className={cn(
            'group flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors cursor-pointer',
            'hover:bg-muted/50',
            checked && 'bg-muted/30'
          )}
          style={{ marginLeft: `${level * 12}px` }}
          onClick={() => handleToggleItem(item)}
        >
          <Checkbox
            checked={checked}
            onCheckedChange={(isChecked) => {
              const nextSelected = new Set(selectedSet)
              toggleItemWithChildren(item, isChecked === true, nextSelected)
              emitChange(nextSelected)
            }}
          />
          <span
            className={cn(
              'text-sm transition-colors',
              checked ? 'text-foreground font-medium' : 'text-muted-foreground'
            )}
          >
            {item.label}
          </span>
          {hasChildren && (
            <span className="ml-auto text-xs text-muted-foreground">
              {item.children!.length}
            </span>
          )}
        </div>
        {hasChildren && (
          <div className="space-y-0.5 border-l border-dashed border-muted/60 pl-2 ml-2">
            {item.children!.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {error && (
        <div className="w-full rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {enableFilter && (
        <div className="w-full flex items-center gap-2 rounded-md border bg-background px-3 py-2 shadow-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="搜索"
            className="flex-1 h-8 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      )}

      {loading && (
        <div className="rounded-md border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
          加载中...
        </div>
      )}

      {!loading && options.length > 0 && (
        <Card className="border-muted/60 shadow-xs w-full">
          <Card.Header className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Card.Title className="text-sm">全部选项</Card.Title>
                <Card.Description className="text-xs text-muted-foreground">
                  勾选将同步选择子级
                </Card.Description>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="small"
                  icon={
                    allTargetSelected ? (
                      <CheckSquare className="h-3.5 w-3.5" />
                    ) : (
                      <Square className="h-3.5 w-3.5" />
                    )
                  }
                  onClick={handleToggleAll}
                >
                  {allTargetSelected ? '取消全选' : '全选'}
                </Button>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  已选择 {selectedCount} 项
                </span>
              </div>
            </div>
          </Card.Header>
          <Card.Content className="pt-0 px-3 pb-3">
            <div className="max-h-[420px] space-y-0.5 overflow-auto">
              {filteredOptions.map((item) => renderItem(item))}
            </div>
          </Card.Content>
        </Card>
      )}

      {!loading && options.length === 0 && (
        <div className="rounded-md border border-dashed bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
          暂无数据
        </div>
      )}
    </div>
  )
}
