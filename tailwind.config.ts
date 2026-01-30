import type { Config } from 'tailwindcss'
import baseConfig from '@cat/uikit/tailwind.config'

/**
 * 根目录 Tailwind 配置
 * 被所有 admin 项目的 globals.css 通过 @config 引用
 */
const config: Config = {
  ...(baseConfig as Config),
  content: [
    './apps/*/src/**/*.{js,ts,jsx,tsx,mdx}',
    './packages/uikit/src/**/*.{js,ts,jsx,tsx,mdx}',
    './packages/uikit/dist/**/*.{js,ts,jsx,tsx,mdx}'
  ]
}

export default config
