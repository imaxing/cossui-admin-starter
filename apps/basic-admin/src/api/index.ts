/**
 * API 模块导出
 * 统一管理所有 API 接口
 *
 * 使用方式：
 * import api from '@/api';
 * api.user.getUserList()
 * api.user.deleteUser(id)
 */

import user from './user'

const api = {
  user
}

export default api

// 也可以单独导出
export { user }

// 导出类型
export type { User, UserListParams, UserListResponse } from './user'
