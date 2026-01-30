/**
 * 类型定义总导出
 * 按业务域划分：common、admin
 */

// ==================== 通用类型 ====================
export type { PagingInfo } from './common.paging'
export type { ListResponse, BatchDeleteParams } from './common.response'

// ==================== 管理后台域 ====================
export type { MenuItem, AdminMenuItem, MenuPayload } from './admin.menu'
