interface TargetConfig {
  sourcePrefix: string
  targetPrefix: string
  targetBaseUrl: string
}

const isProduction = process.env.NODE_ENV === 'production'

export const resolveAuthApiTarget = () =>
  isProduction
    ? 'http://koala-auth-api:80'
    : 'http://localhost:3004'

export const resolveWebboxApiTarget = () =>
  isProduction
    ? 'http://koala-webbox-api:80'
    : 'http://localhost:3002'

export const resolveGuideApiTarget = () =>
  isProduction
    ? 'http://koala-guide-api:80'
    : 'http://localhost:3009'

const buildApiBaseUrl = ({
  baseUrl,
  apiPath
}: {
  baseUrl: string
  apiPath: string
}): string => {
  if (!baseUrl) return ''
  const normalizedBaseUrl = baseUrl.endsWith('/')
    ? baseUrl.slice(0, -1)
    : baseUrl
  const normalizedApiPath = apiPath.startsWith('/') ? apiPath : `/${apiPath}`
  return `${normalizedBaseUrl}${normalizedApiPath}`
}

export const resolveAuthApiBaseUrl = () => {
  return buildApiBaseUrl({
    baseUrl: resolveAuthApiTarget(),
    apiPath: '/api/auth'
  })
}

export const resolveWebboxApiBaseUrl = () => {
  return buildApiBaseUrl({
    baseUrl: resolveWebboxApiTarget(),
    apiPath: '/api/webbox'
  })
}

export const resolveGuideApiBaseUrl = () => {
  return buildApiBaseUrl({
    baseUrl: resolveGuideApiTarget(),
    apiPath: '/api/guide'
  })
}

export const resolveTarget: {
  webbox: TargetConfig
  portal: TargetConfig
  authAdmin: TargetConfig
  guideAdmin: TargetConfig
} = {
  webbox: {
    sourcePrefix: '/auth',
    targetPrefix: '/api/auth',
    targetBaseUrl: resolveAuthApiTarget()
  },
  portal: {
    sourcePrefix: '/auth',
    targetPrefix: '/api/auth',
    targetBaseUrl: resolveAuthApiTarget()
  },
  authAdmin: {
    sourcePrefix: '/auth',
    targetPrefix: '/api/auth',
    targetBaseUrl: resolveAuthApiTarget()
  },
  guideAdmin: {
    sourcePrefix: '/auth',
    targetPrefix: '/api/auth',
    targetBaseUrl: resolveAuthApiTarget()
  }
}
