import type { NextRequest } from 'next/server'

type RewriteConfig = {
  targetBaseUrl: string
  sourcePrefix: string
  targetPrefix: string
}

const buildTargetUrl = (baseUrl: string, pathParts: string[], search: string) => {
  const targetUrl = new URL(baseUrl)
  const basePath = targetUrl.pathname.replace(/\/$/, '')
  const extraPath = pathParts.length > 0 ? `/${pathParts.join('/')}` : ''
  targetUrl.pathname = `${basePath}${extraPath}`
  targetUrl.search = search
  return targetUrl
}

export const createRewriteProxyHandler = (config: RewriteConfig) => {
  return async function proxyHandler(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    const sourcePrefix = config.sourcePrefix.endsWith('/')
      ? config.sourcePrefix.slice(0, -1)
      : config.sourcePrefix
    const relativePath = pathname.startsWith(sourcePrefix)
      ? pathname.slice(sourcePrefix.length)
      : pathname
    const pathParts = relativePath.split('/').filter(Boolean)
    const targetUrl = buildTargetUrl(
      `${config.targetBaseUrl}${config.targetPrefix}`,
      pathParts,
      request.nextUrl.search
    )

    const headers = new Headers(request.headers)
    headers.delete('host')

    const method = request.method.toUpperCase()
    const body =
      method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer()

    console.log(`[Proxy] ${method} ${pathname} -> ${targetUrl.toString()}`)

    const response = await fetch(targetUrl.toString(), {
      method,
      headers,
      body,
      redirect: 'manual',
      credentials: 'include'
    })

    const responseHeaders = new Headers(response.headers)
    const hasCookie = responseHeaders.has('set-cookie')

    console.log(`[Proxy] Response ${response.status}, has Set-Cookie: ${hasCookie}`)

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders
    })
  }
}
