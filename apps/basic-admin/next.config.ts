import type { NextConfig } from 'next'
import { readFileSync } from 'fs'
import { join } from 'path'

// 读取根目录的 package.json 获取版本号
const rootPackageJson = JSON.parse(
  readFileSync(join(__dirname, '../../package.json'), 'utf-8')
)

const basePath =
  process.env.NODE_ENV === 'production' ? process.env.BASE_PATH || '' : ''
const apiUrl = process.env.API_BASE_URL || ''

const nextConfig: NextConfig = {
  basePath,
  transpilePackages: ['@koala/shared', '@koala/uikit'],

  // 仅在生产环境使用 standalone 模式
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),

  // 环境变量
  env: {
    APP_VERSION: rootPackageJson.version,
    API_BASE_URL: apiUrl,
    BASE_PATH: basePath
  }
}

export default nextConfig
