/**
 * 用户相关 API（模拟数据）
 */

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive'
  permissions?: string[]
  createdAt: string
  updatedAt: string
}

export interface UserListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
  role?: string
}

export interface UserListResponse {
  list: User[]
  total: number
}

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟用户数据
let mockUsers: User[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'admin',
    status: 'active',
    permissions: ['read', 'write', 'delete', 'export', 'import', 'audit'],
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-01-20 14:20:00'
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    role: 'editor',
    status: 'active',
    permissions: ['read', 'write', 'export'],
    createdAt: '2024-01-16 09:15:00',
    updatedAt: '2024-01-18 11:45:00'
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    role: 'viewer',
    status: 'inactive',
    permissions: ['read'],
    createdAt: '2024-01-17 16:00:00',
    updatedAt: '2024-01-17 16:00:00'
  },
  {
    id: '4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    role: 'editor',
    status: 'active',
    permissions: ['read', 'write', 'delete'],
    createdAt: '2024-01-18 08:30:00',
    updatedAt: '2024-01-19 09:00:00'
  },
  {
    id: '5',
    name: '钱七',
    email: 'qianqi@example.com',
    role: 'viewer',
    status: 'active',
    permissions: ['read', 'export'],
    createdAt: '2024-01-19 14:45:00',
    updatedAt: '2024-01-19 14:45:00'
  },
  {
    id: '6',
    name: '孙八',
    email: 'sunba@example.com',
    role: 'admin',
    status: 'active',
    permissions: ['read', 'write', 'delete', 'export', 'audit'],
    createdAt: '2024-01-20 10:00:00',
    updatedAt: '2024-01-21 15:30:00'
  },
  {
    id: '7',
    name: '周九',
    email: 'zhoujiu@example.com',
    role: 'editor',
    status: 'inactive',
    permissions: ['read', 'write'],
    createdAt: '2024-01-21 11:20:00',
    updatedAt: '2024-01-21 11:20:00'
  },
  {
    id: '8',
    name: '吴十',
    email: 'wushi@example.com',
    role: 'viewer',
    status: 'active',
    permissions: ['read'],
    createdAt: '2024-01-22 09:30:00',
    updatedAt: '2024-01-23 10:15:00'
  }
]

/**
 * 获取用户列表
 */
export const getUserList = async (params?: UserListParams): Promise<UserListResponse> => {
  await delay(500) // 模拟网络延迟

  let filteredUsers = [...mockUsers]

  // 关键词搜索
  if (params?.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredUsers = filteredUsers.filter(
      user =>
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
    )
  }

  // 状态筛选
  if (params?.status) {
    filteredUsers = filteredUsers.filter(user => user.status === params.status)
  }

  // 角色筛选
  if (params?.role) {
    filteredUsers = filteredUsers.filter(user => user.role === params.role)
  }

  // 分页
  const page = params?.page || 1
  const pageSize = params?.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedUsers = filteredUsers.slice(start, end)

  return {
    list: paginatedUsers,
    total: filteredUsers.length
  }
}

/**
 * 获取用户详情
 */
export const getUserById = async (id: string): Promise<User | null> => {
  await delay(300)
  return mockUsers.find(user => user.id === id) || null
}

/**
 * 创建用户
 */
export const createUser = async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  await delay(500)

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
  const newUser: User = {
    ...data,
    id: String(Date.now()),
    createdAt: now,
    updatedAt: now
  }

  mockUsers = [newUser, ...mockUsers]
  return newUser
}

/**
 * 更新用户
 */
export const updateUser = async (id: string, data: Partial<User>): Promise<User | null> => {
  await delay(500)

  const index = mockUsers.findIndex(user => user.id === id)
  if (index === -1) return null

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
  mockUsers[index] = {
    ...mockUsers[index],
    ...data,
    updatedAt: now
  }

  return mockUsers[index]
}

/**
 * 删除用户
 */
export const deleteUser = async (id: string): Promise<boolean> => {
  await delay(300)

  const index = mockUsers.findIndex(user => user.id === id)
  if (index === -1) return false

  mockUsers.splice(index, 1)
  return true
}

/**
 * 批量删除用户
 */
export const batchDeleteUsers = async (ids: string[]): Promise<boolean> => {
  await delay(500)

  mockUsers = mockUsers.filter(user => !ids.includes(user.id))
  return true
}

export default {
  getUserList,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  batchDeleteUsers
} as const
