# CossUI Admin Starter

基于 pnpm workspace 的后台管理系统启动模板。

## 项目结构

```
.
├── apps/
│   └── basic-admin/          # 后台管理示例应用
├── packages/
│   ├── constants/            # 通用常量
│   ├── shared/               # 共享工具函数
│   ├── types/                # TypeScript 类型定义
│   └── uikit/                # UI 组件库
├── scripts/
│   ├── dev.sh                # 开发启动脚本
│   └── clean.sh              # 清理脚本
└── package.json
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发

```bash
pnpm dev
```

服务将在 http://localhost:3000 启动。

### 构建

```bash
pnpm build
```

## 技术栈

- **框架**: Next.js 16 + React 19
- **样式**: Tailwind CSS 4
- **类型**: TypeScript 5
- **包管理**: pnpm workspace

## Packages 说明

### @koala/uikit
UI 组件库，包含：
- 通用组件（Button, Card, Dialog, Table 等）
- 布局组件（Layout, Sidebar, Breadcrumb）
- 主题支持（明/暗模式切换）

### @koala/shared
共享工具函数，包含：
- HTTP 请求封装
- 日期处理
- 菜单工具函数
- 通用工具函数

### @koala/constants
通用常量定义

### @koala/types
TypeScript 类型定义

## 创建新应用

1. 在 `apps/` 目录下创建新应用
2. 配置 `package.json` 依赖
3. 在 `scripts/dev.sh` 中添加启动配置

## License

MIT
