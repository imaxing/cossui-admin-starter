import { useState, useEffect, useCallback } from 'react'

interface PaginationState {
  current: number
  pageSize: number
  total: number
}

interface UseTableDataOptions<T> {
  fetchData: (params: { page: number; limit: number }) => Promise<{
    data: T[]
    paging?: {
      per_page?: number
      total?: number
    }
  }>
}

export function useTableData<T>({ fetchData }: UseTableDataOptions<T>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 20,
    total: 0
  })

  const loadData = useCallback(
    async (page = 1, pageSize = 20) => {
      setLoading(true)
      try {
        const response = await fetchData({ page, limit: pageSize })
        setData(response.data || [])
        setPagination({
          current: page,
          pageSize: response.paging?.per_page || pageSize,
          total: response.paging?.total || 0
        })
      } catch (error) {
        console.error('加载数据失败:', error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [fetchData]
  )

  useEffect(() => {
    loadData()
  }, [])

  const refresh = useCallback(() => {
    loadData(pagination.current, pagination.pageSize)
  }, [loadData, pagination.current, pagination.pageSize])

  const reload = useCallback(() => {
    loadData(1, pagination.pageSize)
  }, [loadData, pagination.pageSize])

  return {
    data,
    loading,
    pagination,
    loadData,
    refresh,
    reload
  }
}
