/**
 * 响应相关类型
 */

import type { PagingInfo } from './common.paging'

/**
 * 通用列表响应
 */
export interface ListResponse<T> {
  data: T[]
  paging: PagingInfo
}

/**
 * 批量删除参数
 */
export interface BatchDeleteParams {
  ids: string[]
}
