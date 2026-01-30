/**
 * 检测字符串是否为邮箱格式
 */
export function isEmail(text: string): boolean {
  if (!text?.trim()) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim())
}

/**
 * 检测字符串是否为 URL 格式
 */
export function isUrl(text: string): boolean {
  if (!text?.trim()) return false
  const trimmed = text.trim()
  return /^https?:\/\/.+/.test(trimmed) || /^www\..+/.test(trimmed)
}

/**
 * 检测字符串是否为 URL 或邮箱格式
 */
export function isLink(text: string): boolean {
  return isEmail(text) || isUrl(text)
}

/**
 * 获取链接的 href 属性值
 */
export function getLinkHref(text: string): string {
  if (!text?.trim()) return ''

  const trimmed = text.trim()

  if (isEmail(trimmed)) {
    return `mailto:${trimmed}`
  }

  if (isUrl(trimmed)) {
    return trimmed
  }

  return ''
}
