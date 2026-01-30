/**
 * HTML 工具函数
 */

/**
 * 转义 HTML 特殊字符
 */
export function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * 替换模板变量
 * 支持 {{name}} 和 {name} 两种占位符格式
 */
export function replaceVariables(params: {
  content: string
  vars: Record<string, string | number | null | undefined>
}): string {
  const { content, vars } = params
  let html = content

  Object.entries(vars || {}).forEach(([name, raw]) => {
    const value = raw === null || raw === undefined ? '' : String(raw)

    // 关键：没有值就不替换，保留 {var} 作为插值提示
    if (!value) return

    const placeholder1 = `{{${name}}}`
    const placeholder2 = `{${name}}`
    html = html.split(placeholder1).join(value)
    html = html.split(placeholder2).join(value)
  })

  return html
}

/**
 * 向 HTML 中注入标题
 * 如果已有标题，则追加；否则创建标题
 */
export function injectTitle(params: {
  html: string
  title?: string
}): string {
  const { html, title } = params
  const safe_title = escapeHtml(title || '')
  if (!safe_title) return html

  // 1) 有 <title>：拼接模板名
  const title_re = /<title\b[^>]*>([\s\S]*?)<\/title>/i
  if (title_re.test(html)) {
    return html.replace(title_re, (_m, inner) => {
      const current = String(inner || '').trim()
      if (!current) return `<title>${safe_title}</title>`
      if (current.includes(title || '')) return `<title>${current}</title>`
      return `<title>${current} - ${safe_title}</title>`
    })
  }

  // 2) 有 <head>：插入 title
  const head_re = /<head\b[^>]*>/i
  if (head_re.test(html)) {
    return html.replace(head_re, (m) => `${m}<title>${safe_title}</title>`)
  }

  // 3) 有 <html> 但无 head：补 head+title
  const html_re = /<html\b[^>]*>/i
  if (html_re.test(html)) {
    return html.replace(
      html_re,
      (m) => `${m}<head><title>${safe_title}</title></head>`
    )
  }

  // 4) 兜底：包一层完整 HTML
  return `<!doctype html><html><head><title>${safe_title}</title></head><body>${html}</body></html>`
}

/**
 * 向 HTML 中注入 CSS 和 viewport meta 标签
 */
export function injectCss(params: { html: string; css?: string }): string {
  const { html, css } = params

  if (!css) {
    return html
  }

  // 构建 viewport meta 标签（移动端适配）
  const viewport_meta = `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">`

  // 构建 <style> 标签
  const style_tag = `<style data-injected="global-css">\n${css}\n</style>`

  // 组合 meta 和 style
  const injected_content = `${viewport_meta}\n${style_tag}`

  // 尝试注入到 </head> 之前
  if (html.includes('</head>')) {
    return html.replace('</head>', `${injected_content}\n</head>`)
  }

  // 如果没有 </head>，尝试注入到 <body> 之前
  if (html.includes('<body')) {
    return html.replace('<body', `${injected_content}\n<body`)
  }

  // 如果都没有，直接在开头添加
  return injected_content + '\n' + html
}
