/**
 * 响应状态码常量
 * 业务状态码（非HTTP状态码）
 */
export const ResponseCode = {
  // 成功
  SUCCESS: 1003,

  // 客户端错误 (1004-1099)
  BAD_REQUEST: 1004,
  NOT_FOUND: 1005,
  DUPLICATE_KEY: 1007,

  // 认证错误 (1008-1020)
  UNAUTHORIZED: 1008, // 未认证（缺少或无效 Token）
  TOKEN_INVALID: 1009, // Token 无效或过期
  USER_NOT_FOUND: 1010, // 用户不存在
  USER_INACTIVE: 1011, // 用户账号被禁用
  FORBIDDEN: 1012, // 权限不足
  LOGIN_FAILED: 1013, // 登录失败（用户名或密码错误）

  // 服务器错误 (1006, 1100+)
  INTERNAL_ERROR: 1006
} as const
