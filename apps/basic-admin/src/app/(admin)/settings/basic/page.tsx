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
  Label
} from '@cat/uikit'

// 模拟延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function BasicSettingsPage() {
  const message = useMessage()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'Admin Starter',
    siteDescription: '基于 Next.js 的后台管理系统模板',
    logo: '/logo.png',
    favicon: '/favicon.ico',
    recordNumber: '京ICP备12345678号',
    copyright: '© 2024 Admin Starter. All rights reserved.'
  })

  const [notifications, setNotifications] = useState({
    emailNotify: true,
    systemNotify: true,
    loginNotify: false
  })

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await delay(800) // 模拟保存延迟
      message.success('设置已保存')
    } catch (error) {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">基础设置</h1>
      </div>

      <div className="grid gap-6">
        {/* 站点信息 */}
        <Card>
          <CardHeader>
            <CardTitle>站点信息</CardTitle>
            <CardDescription>配置站点的基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="站点名称">
              <Input
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                placeholder="请输入站点名称"
              />
            </FormField>

            <FormField label="站点描述">
              <Input
                value={settings.siteDescription}
                onChange={(e) =>
                  handleChange('siteDescription', e.target.value)
                }
                placeholder="请输入站点描述"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Logo 地址">
                <Input
                  value={settings.logo}
                  onChange={(e) => handleChange('logo', e.target.value)}
                  placeholder="/logo.png"
                />
              </FormField>

              <FormField label="Favicon 地址">
                <Input
                  value={settings.favicon}
                  onChange={(e) => handleChange('favicon', e.target.value)}
                  placeholder="/favicon.ico"
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* 备案信息 */}
        <Card>
          <CardHeader>
            <CardTitle>备案信息</CardTitle>
            <CardDescription>配置站点的备案和版权信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="备案号">
              <Input
                value={settings.recordNumber}
                onChange={(e) => handleChange('recordNumber', e.target.value)}
                placeholder="请输入备案号"
              />
            </FormField>

            <FormField label="版权信息">
              <Input
                value={settings.copyright}
                onChange={(e) => handleChange('copyright', e.target.value)}
                placeholder="请输入版权信息"
              />
            </FormField>
          </CardContent>
        </Card>

        {/* 通知设置 */}
        <Card>
          <CardHeader>
            <CardTitle>通知设置</CardTitle>
            <CardDescription>配置系统通知方式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>邮件通知</Label>
                <p className="text-sm text-muted-foreground">
                  接收重要操作的邮件通知
                </p>
              </div>
              <Switch
                checked={notifications.emailNotify}
                onCheckedChange={(checked) =>
                  handleNotificationChange('emailNotify', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>系统通知</Label>
                <p className="text-sm text-muted-foreground">
                  在系统内显示通知消息
                </p>
              </div>
              <Switch
                checked={notifications.systemNotify}
                onCheckedChange={(checked) =>
                  handleNotificationChange('systemNotify', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>登录提醒</Label>
                <p className="text-sm text-muted-foreground">
                  新设备登录时发送提醒
                </p>
              </div>
              <Switch
                checked={notifications.loginNotify}
                onCheckedChange={(checked) =>
                  handleNotificationChange('loginNotify', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* 保存按钮 */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? '保存中...' : '保存设置'}
          </Button>
        </div>
      </div>
    </div>
  )
}
