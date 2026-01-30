// ==================== Hooks ====================
// 移动端检测
export { useIsMobile } from './hooks/use-mobile'

// 键盘监听
export { useKeyboard, useEscapeKey } from './hooks/use-keyboard'
export type { KeyboardHandler, UseKeyboardOptions } from './hooks/use-keyboard'

// 表格数据管理
export { useTableData } from './hooks/use-table-data'

// 字典数据管理
export { useDict, DictProvider } from './hooks/use-dict'
export type { DictApiConfig, DictProviderProps } from './hooks/use-dict'

// 菜单数据管理
export { useMenuLoader } from './hooks/use-menu-loader'
export type { UseMenuLoaderResult } from './hooks/use-menu-loader'

// ==================== Lib 工具函数 ====================
export * from './lib'

// ==================== 服务器模板 ====================
// templates 模块使用 Node.js fs 模块，仅服务端可用
// 请通过独立路径导入：import { templates } from '@cat/uikit/templates'

// ==================== Layouts 布局组件 ====================
export { default as Layout } from './layouts/Layout'
export { default as PageTransition } from './layouts/PageTransition'
export type {
  LayoutProps,
  MenuItem,
  BreadcrumbItem as LayoutBreadcrumbItem,
  LinkComponentProps,
  IconProps,
  PageTransitionProps
} from './layouts/types'
export * from './layouts/Icons'

// ==================== Skeletons 骨架屏组件 ====================
export * from './skeletons'

// ==================== Common 通用组件（解耦的封装层） ====================
// 这些组件不依赖具体的 UI 框架，业务代码应优先使用这些组件

// 表格组件
export { Table } from './common/Table'
export type { TableProps, TableColumn } from './common/Table'

// 分页组件
export { Pagination } from './common/Pagination'
export type { PaginationProps } from './common/Pagination'

// 按钮组件
export { Button, ButtonGroup } from './common/Button'
export type { ButtonProps, ButtonGroupProps } from './common/Button'

// 选择器组件
export { Select } from './common/Select'
export type { SelectProps, SelectOption } from './common/Select'
export { DictSelect } from './common/DictSelect'
export type { DictSelectProps, DictSelectOption } from './common/DictSelect'

// Tabs 组件（高阶封装 + 原始子组件）
export {
  Tabs,
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent
} from './common/Tabs'
export type { TabsProps, TabsItem } from './common/Tabs'

// Popover 组件（高阶封装 + 原始子组件）
export {
  Popover,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent
} from './common/Popover'
export type { PopoverProps } from './common/Popover'

// DropdownMenu 组件
export { DropdownMenu } from './common/DropdownMenu'
export type { DropdownMenuProps, DropdownMenuItem } from './common/DropdownMenu'

// 模态框组件
export { Modal } from './common/Modal'
export type { ModalProps } from './common/Modal'

// Toast
export { Toaster } from './common/Toaster'

// 输入框组件
export { Input, TextArea } from './common/Input'
export type { InputProps, TextAreaProps } from './common/Input'

// 数字输入框组件
export { InputNumber } from './common/InputNumber'
export type { InputNumberProps } from './common/InputNumber'

// 标签组件
export { LabelField } from './common/Label'
export type { LabelFieldProps } from './common/Label'

// 对话框容器
export { DialogBox } from './common/FormDialog'
export type { DialogBoxProps } from './common/FormDialog'

// Drawer 抽屉组件
export { Drawer } from './common/Drawer'
export type { DrawerProps } from './common/Drawer'

// 表单字段组件
export { FormField } from './common/FormField'
export type { FormFieldProps } from './common/FormField'

// 通用工具组件
export { default as DataTable } from './common/DataTable'
export { TableActions } from './common/TableActions'
export { StatusBadge } from './common/StatusBadge'
export type { StatusBadgeProps, StatusVariant } from './common/StatusBadge'

// Breadcrumb 组件
export { Breadcrumb, BreadcrumbAdvanced } from './common/Breadcrumb'
export type { BreadcrumbProps, BreadcrumbItem } from './common/Breadcrumb'

// Collapsible 组件
export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from './common/Collapsible'
export type {
  CollapsibleProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps
} from './common/Collapsible'

// Label 组件
export { Label } from './common/Label'
export type { LabelProps } from './common/Label'

// Card 组件
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from './common/Card'
export type { CardProps } from './common/Card'

// Checkbox 组件
export { Checkbox } from './common/Checkbox'
export type { CheckboxProps } from './common/Checkbox'

// Tree Select 组件
export { default as TreeSelector } from './common/TreeSelector'
export type {
  TreeSelectorProps,
  TreeSelectorOption
} from './common/TreeSelector'

// Badge 组件
export { Badge } from './common/Badge'
export type { BadgeProps } from './common/Badge'

// ScrollArea 组件
export { ScrollArea, ScrollBar } from './common/ScrollArea'
export type { ScrollAreaProps } from './common/ScrollArea'

// Toggle 组件
export { Toggle } from './common/Toggle'
export type { ToggleProps } from './common/Toggle'

// ==================== UI 基础组件（shadcn/ui 原始组件） ====================
// ⚠️ 临时保留：部分组件(Tooltip等)尚未封装到 Common 层
// TODO: 将 Tooltip, Popover 等组件封装到 Common 层后移除此导出
export * from './ui'

// ==================== Utils 工具函数 ====================
export * from './utils/admin-layout'
export type { RawMenuItem } from './utils/admin-layout'

// ==================== Theme 主题 ====================
export { Providers } from './theme/Providers'
export { ThemeProvider } from './theme/ThemeProvider'
export { ThemeToggle } from './theme/ThemeToggle'

// ==================== RootLayout ====================
export { RootLayout } from './layouts/RootLayout'

// ==================== Icons (lucide-react) ====================
export * from './icons'
export * as LucideIcons from 'lucide-react'

// ==================== Forms 表单组件 ====================
export { LoginForm } from './forms/LoginBasic'
export type {
  LoginFormProps,
  FieldOption,
  FormData,
  FieldRenderContext,
  FieldRenderer
} from './forms/LoginBasic'
