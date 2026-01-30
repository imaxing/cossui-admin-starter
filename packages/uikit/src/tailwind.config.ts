// @ts-check
/** @type {import('tailwindcss').Config} */

import tailwindcssAnimate from 'tailwindcss-animate'

/**
 * Uikit 统一 Tailwind 配置
 *
 * 所有应用应该继承此配置，只需要覆盖 content 路径
 *
 * @example
 * ```typescript
 * // apps/xxx-admin/tailwind.config.ts
 * import baseConfig from '@cat/uikit/tailwind.config'
 *
 * export default {
 *   ...baseConfig,
 *   content: [
 *     './src/app/**\/*.{js,ts,jsx,tsx,mdx}',
 *     '../../packages/uikit/src/**\/*.{js,ts,jsx,tsx,mdx}'
 *   ]
 * }
 * ```
 */
const config = {
  darkMode: 'class',
  content: [
    // 相对于 dist/tailwind.config.js 的路径
    '../../apps/*/src/**/*.{js,ts,jsx,tsx,mdx}',
    // uikit 源码目录
    '../src/**/*.{js,ts,jsx,tsx,mdx}',
    // uikit dist 目录（编译后的组件）
    './**/*.{js,jsx}'
  ],
  plugins: [tailwindcssAnimate],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'var(--font-sans)', 'ui-sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo']
      }
    }
  }
}

export default config
