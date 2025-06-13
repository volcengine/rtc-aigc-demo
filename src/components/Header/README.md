# Header 组件 - 企业级定制化

## 概述

Header 组件已重构为企业级可定制化组件，支持品牌配置、主题定制和响应式设计。

## 功能特性

### ✨ 核心功能
- 🎨 **品牌定制化**: 支持企业 Logo、配色、标语等完全定制
- 📱 **响应式设计**: 完美适配桌面端和移动端
- 🔗 **灵活导航**: 支持多级菜单和外部链接
- 🌐 **多平台集成**: 支持社交媒体链接
- ⚙️ **动态配置**: 运行时配置更新支持

### 🎯 企业级特性
- 完全移除 CSS Module，使用 Tailwind CSS
- TypeScript 类型安全
- 可配置的网络状态指示器
- 无障碍访问支持
- SEO 友好的语义化标签

## 使用方法

### 基础用法

```tsx
import Header from '@/components/Header';

function App() {
  return (
    <Header>
      {/* 中间区域内容 */}
      <div>自定义内容</div>
    </Header>
  );
}
```

### 企业定制化配置

```tsx
import Header from '@/components/Header';
import { BrandConfig } from '@/config/brand';

const customConfig: Partial<BrandConfig> = {
  companyName: "我的公司",
  productName: "AI 对话平台",
  primaryColor: "#0066FF",
  secondaryColor: "#8B5CF6",
  logoUrl: "/assets/img/my-logo.svg",
  navigationLinks: [
    {
      name: "GitHub",
      url: "https://github.com/my-org/my-repo",
      external: true
    },
    {
      name: "文档",
      url: "/docs"
    }
  ]
};

function App() {
  return (
    <Header customConfig={customConfig}>
      <div>自定义内容</div>
    </Header>
  );
}
```

## 配置选项

### BrandConfig 接口

```typescript
interface BrandConfig {
  // 基本品牌信息
  companyName: string;           // 公司名称
  productName: string;           // 产品名称
  logoUrl?: string;              // Logo URL
  logoAlt?: string;              // Logo 替代文本
  
  // 主题配色
  primaryColor: string;          // 主色调
  secondaryColor: string;        // 辅助色
  textGradient?: string;         // 文字渐变样式
  
  // 菜单配置
  menuItems: MenuItem[];         // 左侧下拉菜单项
  navigationLinks: MenuItem[];   // 右侧导航链接
  socialLinks?: SocialLink[];    // 社交媒体链接
  
  // 功能开关
  showNetworkIndicator?: boolean;  // 显示网络指示器
  mobileMenuEnabled?: boolean;     // 启用移动端菜单
  customTagline?: string;          // 自定义标语
}
```

### MenuItem 接口

```typescript
interface MenuItem {
  name: string;        // 显示名称
  url: string;         // 链接地址
  external?: boolean;  // 是否为外部链接
}
```

### SocialLink 接口

```typescript
interface SocialLink {
  name: string;    // 平台名称
  url: string;     // 链接地址
  icon?: string;   // 图标类型 (github, twitter 等)
}
```

## 环境变量配置

可以通过环境变量进行全局配置：

```env
# .env.local
REACT_APP_BRAND_CONFIG='{
  "companyName": "我的公司",
  "productName": "AI 平台",
  "primaryColor": "#0066FF",
  "logoUrl": "/assets/custom-logo.svg"
}'
```

## 样式定制

### 主题色彩
组件支持通过 `BrandConfig` 动态设置主题色彩：

- `primaryColor`: 主色调，用于悬停状态等
- `secondaryColor`: 辅助色，用于渐变等
- `textGradient`: 自定义 CSS 渐变字符串

### Tailwind CSS 类
组件使用以下主要 Tailwind 类，可通过覆盖进行进一步定制：

```css
/* 主容器 */
.header-container {
  @apply h-12 bg-white w-full flex items-center justify-between border-b border-gray-100;
}

/* Logo 区域 */
.header-logo {
  @apply flex items-center px-6;
}

/* 导航链接 */
.header-nav-link {
  @apply text-gray-700 hover:text-blue-600 font-medium transition-colors;
}
```

## 响应式设计

### 桌面端 (≥768px)
- 显示完整的导航链接
- 左侧下拉菜单按钮
- 社交媒体链接在菜单中

### 移动端 (<768px)
- 右侧统一的菜单按钮
- 所有链接合并到下拉菜单
- 简化的布局

## 最佳实践

### 1. Logo 资源
- 推荐使用 SVG 格式，支持缩放
- 建议尺寸：高度 24px，宽度自适应
- 支持深色和浅色主题

### 2. 链接配置
```tsx
// 推荐的链接配置
const navigationLinks = [
  {
    name: "文档",
    url: "/docs"              // 内部路由
  },
  {
    name: "GitHub", 
    url: "https://github.com/...",
    external: true            // 外部链接，新窗口打开
  }
];
```

### 3. 颜色选择
```tsx
// 推荐的颜色配置
const colorConfig = {
  primaryColor: "#0066FF",    // 蓝色系，专业感
  secondaryColor: "#8B5CF6",  // 紫色系，现代感
  textGradient: "linear-gradient(90deg, #0066FF 0%, #8B5CF6 100%)"
};
```

## 迁移指南

### 从旧版本迁移

1. **移除 CSS Module 依赖**：
```tsx
// 旧版本
import styles from './index.module.less';

// 新版本
// 不需要引入样式文件
```

2. **更新属性传递**：
```tsx
// 旧版本
<Header hide={false}>
  {children}
</Header>

// 新版本
<Header 
  hide={false}
  customConfig={brandConfig}
>
  {children}
</Header>
```

3. **配置品牌信息**：
创建 `src/config/brand.ts` 文件并配置企业信息。

## 故障排除

### 常见问题

1. **Logo 不显示**
   - 检查 `logoUrl` 路径是否正确
   - 确认图片资源已正确放置在 `public` 目录

2. **渐变色不生效**
   - 检查 `textGradient` CSS 语法
   - 确认浏览器支持 `background-clip: text`

3. **菜单链接无响应**
   - 检查 `external` 属性设置
   - 确认 URL 格式正确

### 调试模式

开发环境下可以在控制台查看品牌配置：

```tsx
console.log('Brand Config:', getBrandConfig());
```

## 更新日志

### v2.0.0 (当前版本)
- ✅ 完全重构为企业级组件
- ✅ 移除 CSS Module 依赖
- ✅ 添加 Tailwind CSS 支持
- ✅ 实现品牌配置系统
- ✅ 改进响应式设计
- ✅ 添加 TypeScript 类型支持
- ✅ 优化可访问性

### v1.0.0 (火山引擎原版)
- 基础头部组件
- CSS Module 样式
- 固定的火山引擎品牌信息
