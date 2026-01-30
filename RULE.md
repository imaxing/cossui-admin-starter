# RULE.md - Koala 项目开发规范

**本文件是 Koala 项目的核心规范文档，所有开发者（包括 AI 助手）必须严格遵守。**

**AI 助手通用协作规范请参考：`~/RULE.md`**

---

**重要提示**：

- eventhub-admin/google-maps-admin/gmap-proxy-admin 这3个 app **只涉及前端相关的变动**才可以修改
- 接口层面的服务不在当前项目架构中

---

## 🎨 UI 组件分层架构

### 核心原则

**三层架构，严格隔离：**

1. **ui 层** - 只能在 common 层内部使用
2. **common 层** - 封装统一组件，对外不使用前缀
3. **业务层** - 只能使用 common 层组件

```
ui 层 (cossui 基础组件)
  ↓ 只允许 common 层导入
common 层 (封装层 - Button, Input, Table 等)
  ↓ 业务层导入
业务层 (apps/*/src/*)
```

### 封装原则

**Common 层必须：**

1. 组件对外不使用 Ant/UI 等前缀
2. 内部导入 ui 层时用 `as` 重命名（如 `Button as UIButton`）
3. 只暴露单一组件，禁止导出细粒度子组件（DialogContent、DialogHeader 等）
4. 通过 props 或函数式 API 提供功能

### 违规检测

```bash
# 检查业务层是否直接导入 ui 层
grep -r "from '@koala/uikit/ui'" apps/

# 检查是否使用了细粒度子组件
rg "(DialogContent|DialogHeader|CardHeader)" apps/ --type tsx
```

---

## 🎨 UI 颜色系统配置规范（严格禁止修改）

### ⚠️ 核心警告

**以下配置已经过充分测试并稳定运行，严禁任何修改！**

违反此规范将导致：
- 按钮/徽章/对话框背景色透明或颜色错误
- Light/Dark 模式显示异常
- 所有弹出层（Dialog/Menu/Tooltip/Popover 等）显示错误

### 1. 颜色系统架构

**文件位置：** `packages/uikit/src/styles/globals.css`

#### 1.1 颜色格式标准

**必须使用 OKLCH 颜色格式：**

```css
/* ✅ 正确 - OKLCH 格式 */
--primary: oklch(0.205 0 0);
--background: oklch(1 0 0);
--card: oklch(1 0 0);

/* ❌ 错误 - 不要使用 HSL/RGB */
--primary: hsl(0 0% 9%);
--background: rgb(255, 255, 255);
```

#### 1.2 颜色变量命名规范

**语义化命名，成对定义（颜色 + 前景色）：**

```css
:root {
  /* 基础颜色对 */
  --background: oklch(...);
  --foreground: oklch(...);

  /* 卡片/容器颜色 */
  --card: oklch(...);
  --card-foreground: oklch(...);

  /* 主色调（按钮/强调元素） */
  --primary: oklch(...);
  --primary-foreground: oklch(...);

  /* 次要色调 */
  --secondary: oklch(...);
  --secondary-foreground: oklch(...);

  /* 功能色 */
  --destructive: oklch(...);
  --destructive-foreground: oklch(...);
  --success: oklch(...);
  --success-foreground: oklch(...);
}
```

#### 1.3 Dark 模式配置

**必须在 `.dark` 选择器中完整定义所有颜色：**

```css
.dark {
  /* 必须重新定义所有颜色变量 */
  --background: oklch(0.145 0 0);  /* 深色背景 */
  --foreground: oklch(0.985 0 0);  /* 浅色文字 */
  --card: oklch(0.205 0 0);        /* 稍亮的卡片背景 */
  --primary: oklch(0.922 0 0);     /* 浅色主色调 */
  /* ... */
}
```

#### 1.4 Dark 模式 Variant 声明（关键）

**必须在文件顶部声明 dark variant 选择器：**

```css
@custom-variant dark (&:is(.dark, .dark *));
```

**错误配置会导致线上/生产环境 Dark 模式失效：**

```css
/* ❌ 错误 - 只匹配 .dark 的子元素，不匹配 .dark 本身 */
@custom-variant dark (&:is(.dark *));

/* ✅ 正确 - 同时匹配 .dark 本身和其子元素 */
@custom-variant dark (&:is(.dark, .dark *));
```

**原因说明：**
- `next-themes` 会将 `.dark` 类添加到 `<html>` 元素上
- 如果选择器只匹配子元素，`<html>` 本身的样式不会应用 dark 变体
- 这会导致本地开发正常，但生产构建后 Light/Dark 颜色反转

### 2. Tailwind v4 颜色注册（关键）

**必须在 `@theme inline` 块中注册所有颜色变量：**

```css
@theme inline {
  /* 注册所有颜色为 Tailwind 工具类 */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... 必须注册全部颜色 ... */
}
```

**注意：**
- 不注册 = Tailwind 类名不生效（如 `bg-card` 无效）
- 必须使用 `--color-*` 前缀
- 必须引用原始变量 `var(--*)`

### 3. 组件背景色使用规范

#### 3.1 语义化颜色分类

| 颜色类型 | 使用场景 | Tailwind 类名 | 示例组件 |
|---------|---------|--------------|---------|
| `primary` | 主要操作按钮、强调元素 | `bg-primary` | Button, Badge(default), Switch, Checkbox |
| `card` | 卡片、对话框、弹出层背景 | `bg-card` | Dialog, Sheet, Menu, Popover, Tooltip |
| `background` | 页面背景 | `bg-background` | body, page container |
| `secondary` | 次要按钮 | `bg-secondary` | Button(secondary) |
| `muted` | 弱化元素背景 | `bg-muted` | disabled state |

#### 3.2 组件背景色规则

**容器/弹出层组件（必须使用 `bg-card`）：**

```tsx
// ✅ 正确 - 弹出层使用 bg-card
<DialogPopup className="bg-card text-card-foreground" />
<MenuPopup className="bg-card text-card-foreground" />
<TooltipPopup className="bg-card text-card-foreground" />
<PopoverPopup className="bg-card text-card-foreground" />
<SheetContent className="bg-card text-card-foreground" />
<CommandPanel className="bg-card" />

// ❌ 错误 - 不要对弹出层使用 bg-primary
<DialogPopup className="bg-primary" />  // 会导致背景色错误
```

**交互元素（可以使用 `bg-primary`）：**

```tsx
// ✅ 正确 - 按钮/徽章使用 bg-primary
<Button variant="default" className="bg-primary text-primary-foreground" />
<Badge variant="default" className="bg-primary text-primary-foreground" />
<Switch className="data-checked:bg-primary" />
<Checkbox className="data-checked:bg-primary" />
```

### 4. 全局 CSS 重置规则

**严禁对 UI 组件元素添加全局背景色重置：**

```css
/* ❌ 严重错误 - 会导致所有组件背景色失效 */
button, input, select, textarea {
  background-color: initial !important;  /* 破坏性规则 */
}

/* ✅ 正确 - 仅针对未样式化的原生元素 */
input:not([class*='bg-']):not([data-slot]),
select:not([class*='bg-']):not([data-slot]),
textarea:not([class*='bg-']):not([data-slot]) {
  background-color: initial !important;
}
```

**关键点：**
- 移除了对 `button` 的全局重置
- 使用 `:not([data-slot])` 排除 UI 组件
- 使用 `:not([class*='bg-'])` 排除已样式化元素

### 5. 常见错误与修复

#### 错误 1：按钮/Badge 背景色透明

**原因：** 全局 CSS 使用 `!important` 覆盖了背景色

```css
/* ❌ 错误 */
button {
  background-color: initial !important;
}
```

**修复：** 移除或添加排除规则

```css
/* ✅ 正确 */
button:not([data-slot]) {
  background-color: initial;  /* 不使用 !important */
}
```

#### 错误 2：Dialog/Menu 背景色错误

**原因：** 使用了 `bg-primary` 而不是 `bg-card`

```tsx
// ❌ 错误
<DialogPopup className="bg-primary" />

// ✅ 正确
<DialogPopup className="bg-card text-card-foreground" />
```

#### 错误 3：Tailwind 类名不生效

**原因：** 未在 `@theme inline` 中注册颜色变量

```css
/* ❌ 错误 - 缺少注册 */
@theme inline {
  --radius-lg: var(--radius);
}

/* ✅ 正确 - 完整注册 */
@theme inline {
  --color-card: var(--card);
  --color-primary: var(--primary);
  /* ... */
}
```

#### 错误 4：Dark 模式颜色异常

**原因：** `.dark` 选择器中颜色定义不完整

```css
/* ❌ 错误 - 只定义了部分颜色 */
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* 缺少 card, primary 等 */
}

/* ✅ 正确 - 完整定义 */
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  /* ... 所有颜色 ... */
}
```

### 6. 修改流程（极少数情况）

**如果必须修改颜色系统，必须遵循以下流程：**

1. **记录现状**：备份 `globals.css`
2. **修改颜色值**：仅修改 OKLCH 数值，不改结构
3. **验证注册**：确认 `@theme inline` 包含所有变量
4. **测试覆盖**：
   - ✓ Button 各 variant（default/outline/ghost/secondary）
   - ✓ Badge 各 variant（default/success/warning/error）
   - ✓ Dialog/Menu/Tooltip/Popover 显示
   - ✓ Light/Dark 模式切换
   - ✓ 侧边栏导航激活状态
5. **重新构建**：`pnpm build`
6. **更新文档**：同步更新本规范

### 7. 禁止事项清单

- ❌ 禁止修改颜色变量命名规则
- ❌ 禁止改变颜色格式（必须 OKLCH）
- ❌ 禁止删除 `@theme inline` 中的任何注册
- ❌ 禁止对 UI 组件元素添加全局 `!important` 样式
- ❌ 禁止在弹出层组件中使用 `bg-primary`
- ❌ 禁止在交互元素中使用 `bg-card`（除非特殊设计需求）
- ❌ **禁止修改 `@custom-variant dark` 选择器**（必须同时匹配 `.dark` 本身和子元素）

### 8. 验证命令

```bash
# 构建 uikit 包
cd packages/uikit && pnpm build

# 检查是否有组件误用 bg-primary（排除 Button/Badge/Switch 等）
rg "bg-primary" packages/uikit/src/ui/ | grep -E "(dialog|sheet|menu|popover|tooltip|command|combobox|autocomplete)"

# 检查全局样式是否有破坏性规则
rg "background-color.*!important" packages/uikit/src/styles/
```

---

#### 错误 5：线上 Light/Dark 模式颜色反转

**原因：** `@custom-variant dark` 选择器只匹配子元素

```css
/* ❌ 错误 - 导致生产环境颜色反转 */
@custom-variant dark (&:is(.dark *));

/* ✅ 正确 */
@custom-variant dark (&:is(.dark, .dark *));
```

---

**配置最后验证日期：** 2026-01-28
**验证状态：** ✅ 所有组件 Light/Dark 模式正常显示（本地 + 生产）

---

## 🧩 前端组件调用规范

### 核心规则

1. **表格**：必须用 `useTableData` hook + Table组件，禁止手写获取数据逻辑(参考webboxadmin中的功能)
2. **弹窗**：必须用 `createDialog` 函数，禁止使用 `<Dialog>` 标签
3. **createDialog 的 component**：必须封装到 `@/components`，不允许直接写大量标签

### 正确示例

```typescript
// ✅ 表格
const { tableProps } = useTableData({
  fetchData: api.list,
  columns,
  rowKey: 'uuid'
})
return <Table {...tableProps} />

// ✅ 弹窗
const handleCreate = () => {
  createDialog({
    title: '新建',
    component: <MyForm onSuccess={refresh} /> // 组件内外层标签不需要padding
  })
}
```

---

## 📊 数据库规范

### 命名规范（强制）

**全部使用 snake_case：**

- 表名：`auth_users`, `webbox_templates`
- 字段名：`user_uuid`, `created_at`, `menu_uuids`
- 索引名：`idx_auth_users_username`

**禁止 camelCase：**

- ❌ `userId`, `createdAt`, `menuUuids`

### 必需字段

**所有表必须包含：**

```sql
uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP  -- 软删除
```

### 外键命名

格式：`{关联表}_uuid`

```sql
user_uuid VARCHAR(36)  -- 关联 auth_users
app_uuid VARCHAR(36)   -- 关联 auth_apps
```

### TypeScript 类型同步

**类型定义必须与数据库完全一致：**

```typescript
// ✅ 正确
export interface UserAppDTO {
  uuid: string
  user_uuid: string
  app_uuid: string
  created_at?: string
  updated_at?: string
}
```

### 增量 SQL 规范

**所有变更通过增量脚本，必须幂等：**

**注意**：

- ✅ 编写增量 SQL 脚本
- ✅ 使用 IF NOT EXISTS 确保幂等
- ❌ **不需要更新 README 文档**

```sql
-- 示例：幂等的字段添加
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'auth_apps' AND column_name = 'icon'
  ) THEN
    ALTER TABLE "auth_apps" ADD COLUMN "icon" VARCHAR(100);
    COMMENT ON COLUMN "auth_apps"."icon" IS '应用图标';
  END IF;
END $$;
```

---

## ✅ Router → Service 规范

1. **Router**：只做参数提取/鉴权/响应
2. **Service**：处理所有业务逻辑
3. **统一错误处理**：`Response.serviceError(res, error)`
4. **返回结构**：列表 `{ data, paging }`，详情直接返回对象

---

## 🔐 认证与授权

1. **统一入口**：通过 `@koala/auth/client` 的 `AuthProvider`
2. **应用权限校验**：`getUserConfig` + `appCode`
3. **静默检查**：标签页切换时不刷新 UI

---

## 🏗️ 项目架构

### Monorepo 结构

```
apps/     - 独立部署的应用（admin、api、render）
packages/ - 共享代码包（types、constants、shared、db、server、uikit、auth）
```

### 包依赖

```
*-admin → types, constants, shared, uikit, auth/client
*-api   → types, constants, shared, db, server, auth
*-render → types, shared, server
```

---

## 🔮 扩展开发

### 添加新页面

1. 在 `*-admin/src/app/(admin)/` 创建页面
2. 使用 `@koala/uikit` 组件
3. 使用 `useTableData` + `createDialog`

### 添加新 API

1. 在 `*-api/src/services/` 创建 Service（继承 BaseService）
2. 在 `*-api/src/routes/` 添加路由
3. 注册到 `src/index.ts`

---

**最后更新：** 2026-01-28
