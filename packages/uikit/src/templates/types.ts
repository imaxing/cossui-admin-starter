/**
 * 404 页面数据类型
 */
export interface NotFoundPageData {
  path: string
  host: string
  reason?: string
  title: string
  subtitle: string
  btn_refresh: string
  label_request_url: string
  label_view_reason: string
  default_reason: string
}

/**
 * 500 页面数据类型
 */
export interface ServerErrorPageData {
  path: string
  host: string
  error?: string
  title: string
  subtitle: string
  btn_refresh: string
  label_request_url: string
  label_error_message: string
}

/**
 * API 接口定义
 */
export interface ApiEndpoint {
  method: string
  path: string
  description: string
  example?: string
}

/**
 * API 接口分组
 */
export interface ApiEndpointGroup {
  title: string
  routes: ApiEndpoint[]
}

/**
 * API 文档数据类型
 */
export interface ApiDocsData {
  title: string
  description: string
  base_url_title: string
  base_url: string
  example_label: string
  endpoints: ApiEndpointGroup[]
}

/**
 * 模板数据映射表
 */
export type TemplateDataMap = {
  'error-404': NotFoundPageData
  'error-500': ServerErrorPageData
  'api-docs': ApiDocsData
}

/**
 * 模板名称类型
 */
export type TemplateName = keyof TemplateDataMap

/**
 * 渲染参数类型
 */
export interface RenderParams<T extends TemplateName = TemplateName> {
  name: T
  data: TemplateDataMap[T]
}
