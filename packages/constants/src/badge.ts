/**
 * Badge 组件相关常量配置
 */

export interface BadgeConfig {
  text: string
  variant: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'secondary' | 'destructive'
  dot?: string // 圆点颜色
}

/**
 * 通用状态配置
 */
export const STATUS_BADGE_CONFIG: Record<string, BadgeConfig> = {
  active: { text: '启用', variant: 'success', dot: '#10b981' },
  inactive: { text: '停用', variant: 'warning', dot: '#f59e0b' },
  suspended: { text: '停用', variant: 'warning', dot: '#f59e0b' },
  banned: { text: '封禁', variant: 'error', dot: '#ef4444' },
  archived: { text: '归档', variant: 'outline', dot: '#6b7280' }
}

/**
 * 用户状态配置
 */
export const USER_STATUS_BADGE_CONFIG: Record<string, BadgeConfig> = {
  active: { text: '正常', variant: 'success', dot: '#10b981' },
  inactive: { text: '停用', variant: 'warning', dot: '#f59e0b' },
  suspended: { text: '停用', variant: 'warning', dot: '#f59e0b' },
  banned: { text: '封禁', variant: 'error', dot: '#ef4444' }
}

/**
 * 模板状态配置
 */
export const TEMPLATE_STATUS_BADGE_CONFIG: Record<string, BadgeConfig> = {
  active: { text: '启用', variant: 'success', dot: '#10b981' },
  draft: { text: '草稿', variant: 'warning', dot: '#f59e0b' },
  archived: { text: '归档', variant: 'error', dot: '#6b7280' }
}

/**
 * 配置状态
 */
export const CONFIG_STATUS_BADGE_CONFIG: Record<string, BadgeConfig> = {
  configured: { text: '已配置', variant: 'success', dot: '#10b981' },
  unconfigured: { text: '未配置', variant: 'outline', dot: '#6b7280' }
}

/**
 * 事件状态配置 (EventHub)
 */
export const EVENT_STATUS_BADGE_CONFIG: Record<string | number, BadgeConfig> = {
  0: { text: '待处理', variant: 'warning', dot: '#f59e0b' },
  1: { text: '处理中', variant: 'info', dot: '#3b82f6' },
  2: { text: '已完成', variant: 'success', dot: '#10b981' },
  3: { text: '失败', variant: 'error', dot: '#ef4444' }
}

/**
 * 投递状态配置 (EventHub)
 */
export const DELIVERY_STATUS_BADGE_CONFIG: Record<string | number, BadgeConfig> = {
  0: { text: '待投递', variant: 'warning', dot: '#f59e0b' },
  1: { text: '投递中', variant: 'info', dot: '#3b82f6' },
  2: { text: '成功', variant: 'success', dot: '#10b981' },
  3: { text: '失败', variant: 'error', dot: '#ef4444' }
}

/**
 * API Key 状态配置 (Google Maps)
 */
export const API_KEY_STATUS_BADGE_CONFIG: Record<string | number, BadgeConfig> = {
  1: { text: '正常', variant: 'success', dot: '#10b981' },
  2: { text: '备用', variant: 'warning', dot: '#f59e0b' },
  3: { text: '错误', variant: 'error', dot: '#ef4444' }
}

/**
 * API Key 账户类型配置 (Google Maps)
 */
export const API_KEY_ACCOUNT_TYPE_BADGE_CONFIG: Record<string, BadgeConfig> = {
  ant: { text: '日常', variant: 'info', dot: '#3b82f6' },
  main: { text: '兜底', variant: 'secondary', dot: '#8b5cf6' }
}

/**
 * 用户角色配置 (Google Maps Admin)
 */
export const USER_ROLE_BADGE_CONFIG: Record<string, BadgeConfig> = {
  admin: { text: '管理员', variant: 'info', dot: '#3b82f6' },
  super_admin: { text: '超级管理员', variant: 'secondary', dot: '#8b5cf6' }
}

/**
 * 启用/禁用状态配置 (通用)
 */
export const ENABLED_STATUS_BADGE_CONFIG: Record<string | number, BadgeConfig> = {
  0: { text: '禁用', variant: 'error', dot: '#ef4444' },
  1: { text: '启用', variant: 'success', dot: '#10b981' }
}
