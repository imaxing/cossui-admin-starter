import type { NextRequest, NextResponse } from 'next/server'

export type ProxyContext = {
  params: {
    path?: string[]
  }
}

export type ProxyTargetResolver = () => string

const buildTargetUrl = (baseUrl: string, pathParts: string[], search: string) => {
  const targetUrl = new URL(baseUrl)
  const basePath = targetUrl.pathname.replace(/\/$/, '')
  const extraPath = pathParts.length > 0 ? `/${pathParts.join('/')}` : ''
  targetUrl.pathname = `${basePath}${extraPath}`
  targetUrl.search = search
  return targetUrl
}

type NextServerModule = {
  NextResponse: typeof NextResponse
}

export const createProxyHandler = (targetBaseUrl: string) => {
  return async function proxyHandler(
    request: NextRequest,
    context: ProxyContext
  ) {
    const { NextResponse } = require('next/server') as NextServerModule
    const params = await Promise.resolve(context.params)
    const pathParts = params?.path ?? []
    const targetUrl = buildTargetUrl(
      targetBaseUrl,
      pathParts,
      request.nextUrl.search
    )

    const headers = new Headers(request.headers)
    headers.delete('host')

    const method = request.method.toUpperCase()
    const body =
      method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer()

    const response = await fetch(targetUrl.toString(), {
      method,
      headers,
      body,
      redirect: 'manual'
    })

    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers
    })
  }
}
