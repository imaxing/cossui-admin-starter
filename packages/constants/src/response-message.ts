/**
 * 通用响应消息常量
 */
export const CommonMessage = {
  // 成功消息
  SUCCESS: '',
  OPERATION_SUCCESS: '操作成功',
  CREATED_SUCCESS: '创建成功',
  UPDATED_SUCCESS: '更新成功',
  DELETED_SUCCESS: '删除成功',

  // 通用错误
  BAD_REQUEST: '请求参数错误',
  NOT_FOUND: '资源不存在',
  INTERNAL_ERROR: '服务器内部错误',
  DUPLICATE_KEY: '数据已存在,请勿重复创建'
} as const

/**
 * 认证相关消息常量
 */
export const AuthMessage = {
  MISSING_TOKEN: '缺少授权信息或授权信息无效',
  TOKEN_INVALID: 'Token 无效或已过期',
  USER_NOT_FOUND: '用户不存在',
  USER_INACTIVE: '用户账号已被停用或封禁',
  INSUFFICIENT_PERMISSIONS: '权限不足',
  LOGIN_FAILED: '用户名或密码错误',
  REGISTER_SUCCESS: '注册成功',
  LOGIN_SUCCESS: '登录成功',
  LOGOUT_SUCCESS: '退出成功'
} as const

/**
 * 用户管理消息常量
 */
export const UserMessage = {
  CREATED: '用户创建成功',
  UPDATED: '用户更新成功',
  DELETED: '用户删除成功',
  USERNAME_EXISTS: '用户名已存在',
  EMAIL_EXISTS: '邮箱已存在',
  PASSWORD_TOO_SHORT: '密码长度至少为 6 位',
  USERNAME_TOO_SHORT: '用户名长度必须在 3-50 个字符之间',
  INVALID_EMAIL: '邮箱格式不正确',
  INVALID_ROLE: '角色无效,必须是以下之一:admin、editor、viewer'
} as const

/**
 * 合并的响应消息（向后兼容）
 */
export const ResponseMessage = {
  // 成功消息
  SUCCESS: CommonMessage.SUCCESS,
  OPERATION_SUCCESS: CommonMessage.OPERATION_SUCCESS,
  CREATED_SUCCESS: CommonMessage.CREATED_SUCCESS,
  UPDATED_SUCCESS: CommonMessage.UPDATED_SUCCESS,
  DELETED_SUCCESS: CommonMessage.DELETED_SUCCESS,

  // 通用错误
  BAD_REQUEST: CommonMessage.BAD_REQUEST,
  NOT_FOUND: CommonMessage.NOT_FOUND,
  INTERNAL_ERROR: CommonMessage.INTERNAL_ERROR,
  DUPLICATE_KEY: CommonMessage.DUPLICATE_KEY,

  // 认证相关
  AUTH: AuthMessage,

  // 用户管理
  USER: UserMessage
} as const
