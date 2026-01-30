'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Button,
  Input,
  Select,
  Table,
  Pagination,
  Badge,
  FormField,
  TableActions,
  useMessage,
  createDialog,
  Plus,
  Search,
  RefreshCw
} from '@koala/uikit'
import type { TableColumn } from '@koala/uikit'
import userApi, { type User, type UserListParams } from '@/api/user'

// 角色选项
const roleOptions = [
  { value: '', label: '全部角色' },
  { value: 'admin', label: '管理员' },
  { value: 'editor', label: '编辑' },
  { value: 'viewer', label: '访客' }
]

// 状态选项
const statusOptions = [
  { value: '', label: '全部状态' },
  { value: 'active', label: '正常' },
  { value: 'inactive', label: '禁用' }
]

// 角色标签颜色
const roleBadgeVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  editor: 'secondary',
  viewer: 'outline'
}

// 角色名称
const roleLabel: Record<string, string> = {
  admin: '管理员',
  editor: '编辑',
  viewer: '访客'
}

// 用户表单组件
function UserForm({
  initialData,
  onSubmit
}: {
  initialData?: Partial<User>
  onSubmit: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    role: initialData?.role || 'viewer',
    status: initialData?.status || 'active'
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 暴露 submit 方法给 dialog
  ;(window as any).__formSubmit = async () => {
    if (!formData.name.trim()) {
      throw new Error('请输入用户名')
    }
    if (!formData.email.trim()) {
      throw new Error('请输入邮箱')
    }
    await onSubmit(formData as any)
  }

  return (
    <div className="space-y-4 py-2">
      <FormField label="用户名" required>
        <Input
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="请输入用户名"
        />
      </FormField>

      <FormField label="邮箱" required>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="请输入邮箱"
        />
      </FormField>

      <FormField label="角色">
        <Select
          value={formData.role}
          onChange={(value) => handleChange('role', value)}
          options={roleOptions.slice(1)}
        />
      </FormField>

      <FormField label="状态">
        <Select
          value={formData.status}
          onChange={(value) => handleChange('status', value)}
          options={statusOptions.slice(1)}
        />
      </FormField>
    </div>
  )
}

export default function UsersPage() {
  const message = useMessage()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [params, setParams] = useState<UserListParams>({
    page: 1,
    pageSize: 10,
    keyword: '',
    status: '',
    role: ''
  })

  // 加载数据
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await userApi.getUserList(params)
      setUsers(result.list)
      setTotal(result.total)
    } catch (error: any) {
      message.error(error?.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }, [params, message])

  useEffect(() => {
    loadData()
  }, [loadData])

  // 搜索
  const handleSearch = (keyword: string) => {
    setParams(prev => ({ ...prev, keyword, page: 1 }))
  }

  // 筛选
  const handleFilter = (field: string, value: string) => {
    setParams(prev => ({ ...prev, [field]: value, page: 1 }))
  }

  // 分页
  const handlePageChange = (page: number, pageSize: number) => {
    setParams(prev => ({ ...prev, page, pageSize }))
  }

  // 新增用户
  const handleCreate = () => {
    createDialog({
      title: '新增用户',
      width: 480,
      buttons: [
        { text: '取消', callback: 'cancel' },
        { text: '确定', callback: 'submit', type: 'primary' }
      ],
      onSubmit: async () => {
        await (window as any).__formSubmit()
      },
      component: (
        <UserForm
          onSubmit={async (data) => {
            await userApi.createUser(data)
            message.success('创建成功')
            loadData()
          }}
        />
      )
    })
  }

  // 编辑用户
  const handleEdit = (user: User) => {
    createDialog({
      title: '编辑用户',
      width: 480,
      buttons: [
        { text: '取消', callback: 'cancel' },
        { text: '确定', callback: 'submit', type: 'primary' }
      ],
      onSubmit: async () => {
        await (window as any).__formSubmit()
      },
      component: (
        <UserForm
          initialData={user}
          onSubmit={async (data) => {
            await userApi.updateUser(user.id, data)
            message.success('更新成功')
            loadData()
          }}
        />
      )
    })
  }

  // 删除用户
  const handleDelete = async (user: User) => {
    await userApi.deleteUser(user.id)
    message.success('删除成功')
    loadData()
  }

  // 表格列定义
  const columns: TableColumn[] = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      width: 120
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => (
        <Badge variant={roleBadgeVariant[role] || 'outline'}>
          {roleLabel[role] || role}
        </Badge>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status === 'active' ? '正常' : '禁用'}
        </Badge>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 160
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
      render: (_: unknown, record: User) => (
        <TableActions
          actions={[
            { text: '编辑', onClick: () => handleEdit(record) },
            { text: '删除', onClick: () => handleDelete(record), confirm: true }
          ]}
        />
      )
    }
  ]

  return (
    <div className="space-y-4">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          新增用户
        </Button>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 w-60"
              placeholder="搜索用户名或邮箱"
              value={params.keyword}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select
            className="w-28"
            value={params.role || ''}
            onChange={(value) => handleFilter('role', value)}
            options={roleOptions}
          />
          <Select
            className="w-28"
            value={params.status || ''}
            onChange={(value) => handleFilter('status', value)}
            options={statusOptions}
          />
        </div>
        <Button variant="outline" size="sm" onClick={loadData}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={false}
      />

      {/* 分页 */}
      {total > 0 && (
        <div className="flex justify-end">
          <Pagination
            current={params.page || 1}
            pageSize={params.pageSize || 10}
            total={total}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}
