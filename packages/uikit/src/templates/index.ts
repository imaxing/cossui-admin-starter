import Handlebars from 'handlebars'
import type { TemplateDelegate as HandlebarsTemplateDelegate } from 'handlebars'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { TemplateName, TemplateDataMap, RenderParams } from './types'

// 获取模板目录路径(与编译后的 index.js 同级)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const TEMPLATES_DIR = __dirname

// 模板缓存
const templateCache = new Map<string, HandlebarsTemplateDelegate>()

/**
 * 加载并编译模板
 * @param name 模板名称(不含扩展名)
 */
function loadTemplate(name: string): HandlebarsTemplateDelegate {
  if (templateCache.has(name)) {
    return templateCache.get(name)!
  }

  const templatePath = join(TEMPLATES_DIR, `${name}.hbs`)
  const templateSource = readFileSync(templatePath, 'utf-8')
  const template = Handlebars.compile(templateSource)

  templateCache.set(name, template)
  return template
}

/**
 * 通用模板渲染方法
 * @param params 渲染参数 { name, data }
 */
export function renderTemplate<T extends TemplateName>(
  params: RenderParams<T>
): string {
  const { name, data } = params
  const template = loadTemplate(name)
  return template(data)
}

/**
 * 清除模板缓存
 */
export function clearTemplateCache(): void {
  templateCache.clear()
}

/**
 * 模板渲染工具集合
 */
const templates = {
  /**
   * 渲染 404 页面
   */
  notFound(data: TemplateDataMap['error-404']): string {
    return renderTemplate({ name: 'error-404', data })
  },

  /**
   * 渲染 500 页面
   */
  serverError(data: TemplateDataMap['error-500']): string {
    return renderTemplate({ name: 'error-500', data })
  },

  /**
   * 渲染 API 文档页面
   */
  apiDocs(data: TemplateDataMap['api-docs']): string {
    return renderTemplate({ name: 'api-docs', data })
  }
}

// 默认导出
export default templates

// 导出所有类型
export type {
  TemplateName,
  TemplateDataMap,
  RenderParams,
  NotFoundPageData,
  ServerErrorPageData,
  ApiDocsData,
  ApiEndpoint,
  ApiEndpointGroup
} from './types'
