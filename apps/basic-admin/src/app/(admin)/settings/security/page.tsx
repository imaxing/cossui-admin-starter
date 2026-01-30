'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  FormField,
  useMessage,
  Switch,
  Label,
  Badge,
  Table
} from '@cat/uikit'
import type { TableColumn } from '@cat/uikit'

// 模拟延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 模拟登录日志
const loginLogs = [
  {
    id: '1',
    time: '2024-01-25 10:30:15',
    ip: '192.168.1.100',
    location: '北京市',
    device: 'Chrome / Windows',
    status: 'success'
  },
  {
    id: '2',
    time: '2024-01-24 14:22:08',
    ip: '192.168.1.101',
    location: '上海市',
    device: 'Safari / macOS',
    status: 'success'
  },
  {
    id: '3',
    time: '2024-01-23 09:15:33',
    ip: '10.0.0.55',
    location: '广州市',
    device: 'Firefox / Linux',
    status: 'failed'
  },
  {
    id: '4',
    time: '2024-01-22 16:45:20',
    ip: '192.168.1.100',
    location: '北京市',
    device: 'Chrome / Windows',
    status: 'success'
  },
  {
    id: '5',
    time: '2024-01-21 11:30:00',
    ip: '172.16.0.10',
    location: '深圳市',
    device: 'Edge / Windows',
    status: 'success'
  }
]

export default function SecuritySettingsPage() {
  const message = useMessage()
  const [loading, setLoading] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlert: true,
    sessionTimeout: true
  })

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSecurityChange = (field: string, value: boolean) => {
    setSecurity((prev) => ({ ...prev, [field]: value }))
  }

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword) {
      message.error('请输入当前密码')
      return
    }
    if (!passwordForm.newPassword) {
      message.error('请输入新密码')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      message.error('密码长度不能少于6位')
      return
    }

    setLoading(true)
    try {
      await delay(800)
      message.success('密码修改成功')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      message.error('密码修改失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSecurity = async () => {
    setLoading(true)
    try {
      await delay(500)
      message.success('安全设置已保存')
    } catch (error) {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  // 登录日志表格列
  const columns: TableColumn[] = [
    {
      title: '登录时间',
      dataIndex: 'time',
      key: 'time',
      width: 180
    },
    {
      title: 'IP 地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 140
    },
    {
      title: '登录地点',
      dataIndex: 'location',
      key: 'location',
      width: 100
    },
    {
      title: '设备信息',
      dataIndex: 'device',
      key: 'device',
      width: 160
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (value: unknown) => {
        const status = value as string
        return (
          <Badge variant={status === 'success' ? 'default' : 'destructive'}>
            {status === 'success' ? '成功' : '失败'}
          </Badge>
        )
      }
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">安全设置</h1>
      </div>

      <div className="grid gap-6">
        {/* 修改密码 */}
        <Card>
          <CardHeader>
            <CardTitle>修改密码</CardTitle>
            <CardDescription>定期修改密码可以提高账户安全性</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="当前密码">
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  handlePasswordChange('currentPassword', e.target.value)
                }
                placeholder="请输入当前密码"
              />
            </FormField>

            <FormField label="新密码">
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  handlePasswordChange('newPassword', e.target.value)
                }
                placeholder="请输入新密码（至少6位）"
              />
            </FormField>

            <FormField label="确认密码">
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  handlePasswordChange('confirmPassword', e.target.value)
                }
                placeholder="请再次输入新密码"
              />
            </FormField>

            <div className="flex justify-end">
              <Button onClick={handleChangePassword} disabled={loading}>
                {loading ? '提交中...' : '修改密码'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 安全选项 */}
        <Card>
          <CardHeader>
            <CardTitle>安全选项</CardTitle>
            <CardDescription>配置账户的安全策略</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>两步验证</Label>
                <p className="text-sm text-muted-foreground">
                  登录时需要输入手机验证码
                </p>
              </div>
              <Switch
                checked={security.twoFactorAuth}
                onCheckedChange={(checked) =>
                  handleSecurityChange('twoFactorAuth', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>异地登录提醒</Label>
                <p className="text-sm text-muted-foreground">
                  在新设备或新地点登录时发送提醒
                </p>
              </div>
              <Switch
                checked={security.loginAlert}
                onCheckedChange={(checked) =>
                  handleSecurityChange('loginAlert', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>会话超时</Label>
                <p className="text-sm text-muted-foreground">
                  30分钟无操作自动退出登录
                </p>
              </div>
              <Switch
                checked={security.sessionTimeout}
                onCheckedChange={(checked) =>
                  handleSecurityChange('sessionTimeout', checked)
                }
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleSaveSecurity} disabled={loading}>
                保存设置
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 登录日志 */}
        <Card>
          <CardHeader>
            <CardTitle>登录日志</CardTitle>
            <CardDescription>最近的登录记录</CardDescription>
          </CardHeader>
          <CardContent>
            <Table
              columns={columns}
              dataSource={loginLogs as unknown as Record<string, unknown>[]}
              rowKey="id"
              pagination={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
