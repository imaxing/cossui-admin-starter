import { Snowflake } from '@sapphire/snowflake'

/**
 * Snowflake ID 生成器
 * - 使用自定义 epoch (2020-01-01) 减少时间戳位数
 * - 生成 18 位纯数字字符串 UUID
 *
 * 注意：@sapphire/snowflake 基于 Discord Snowflake 算法
 */
const snowflake = new Snowflake(new Date('2020-01-01T00:00:00Z').getTime())

/**
 * 生成 18 位纯数字字符串 UUID
 * 基于 Snowflake 算法，确保分布式环境下的唯一性
 *
 * 特点:
 * - 时间有序（可按时间排序）
 * - 分布式唯一（支持多机部署）
 * - 高性能（无需数据库查询）
 * - 固定长度 18 位数字
 *
 * @returns {string} 18 位数字字符串
 * @example "234567890123456789"
 */
export function generateUUID(): string {
  const id = snowflake.generate()
  const idStr = id.toString()

  // 确保长度为 18 位（如果超过则截取后 18 位，如果不足则补零）
  if (idStr.length > 18) {
    return idStr.slice(-18)
  }
  return idStr.padStart(18, '0')
}
