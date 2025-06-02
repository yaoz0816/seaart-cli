# @ipzero/seaart-cli

🎨 SeaArt React Native 项目脚手架工具

[![npm version](https://badge.fury.io/js/@ipzero%2Fseaart-cli.svg)](https://badge.fury.io/js/@ipzero%2Fseaart-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🚀 一个专为海艺团队打造的企业级 React Native 开发脚手架，让团队快速构建高质量移动应用！

## ⭐ 特色亮点

- ✅ **最新技术栈** - React Native 0.76.9 + TypeScript 5.8.3 + Expo 52
- ✅ **企业级架构** - 完整的导航、网络、状态管理解决方案
- ✅ **开箱即用** - 智能缓存、请求重试、错误处理一应俱全
- ✅ **现代化样式** - TailwindCSS (twrnc) 集成，快速开发响应式界面
- ✅ **完整示例** - 从登录到列表，覆盖常见业务场景
- ✅ **开发友好** - 详细文档、代码模板、性能监控

## 📦 安装

```bash
# 全局安装（推荐）
npm install -g @ipzero/seaart-cli

# 或使用 yarn
yarn global add @ipzero/seaart-cli

# 或使用 pnpm
pnpm add -g @ipzero/seaart-cli

# 临时使用（无需安装）
npx @ipzero/seaart-cli create MyAwesomeApp
```

## 🚀 快速开始

### 创建新项目

```bash
# 创建标准项目
seaart create MyAwesomeApp

# 指定包名
seaart create MyAwesomeApp --package-name com.company.myapp

# 跳过依赖安装
seaart create MyAwesomeApp --skip-install

# 指定包管理器
seaart create MyAwesomeApp --package-manager yarn
```

### 项目创建过程

脚手架会自动执行以下步骤：
1. 📦 从 Git 仓库下载最新企业级模版
2. ⚙️ 配置项目名称和包名
3. 📚 安装项目依赖（可跳过）
4. 🔧 初始化 Git 仓库
5. ✅ 完成项目创建

### 快速开始开发

```bash
# 进入项目目录
cd MyAwesomeApp

# 安装依赖（如果之前跳过了）
pnpm install

# 启动开发服务器
pnpm start

# 运行 Android 应用
pnpm run android

# 运行 iOS 应用
pnpm run ios

# 清理缓存重新启动
pnpm start --reset-cache
```

## 🏗️ 企业级架构特性

### 🌐 智能网络库

```tsx
import { get, post, upload } from '@/utils/http/request'

// 带缓存的 GET 请求
const userData = await get('/api/user', params, {
  cache: { ttl: 5 * 60 * 1000 }, // 5分钟缓存
  retry: { retries: 2 }, // 自动重试
  deduplication: true, // 请求去重
})

// 文件上传进度
await upload('/api/upload', file, {
  onProgress: (progress) => console.log(`${progress}%`),
})
```

### 🎨 TailwindCSS 样式系统

```tsx
import { tw } from '@/utils/twcss/twrnc'

// 快速样式开发
<View style={tw('flex-1 bg-gray-100 p-4')}>
  <Text style={tw('text-xl font-bold text-blue-600 text-center')}>
    TailwindCSS 让样式开发飞起来！
  </Text>
</View>
```

### 🧭 类型安全导航

```tsx
import { navigate, goBack } from '@/navigation'

// TypeScript 类型安全导航
navigate('UserProfile', { userId: '123' })
goBack()
```

### 📋 高性能列表

```tsx
import { FlashList } from '@shopify/flash-list'

<FlashList
  data={posts}
  renderItem={({ item }) => <PostCard post={item} />}
  estimatedItemSize={200}
  // 自动虚拟化，性能优异
/>
```

## 📋 完整命令列表

### 项目创建和配置

- `seaart create <project-name>` - 创建新的 React Native 项目
- `seaart setup` - 配置现有项目的名称和包名
- `seaart doctor` - 检查开发环境和项目配置
- `seaart info` - 显示项目和环境信息

### 代码生成（计划中）

- `seaart add <type>` - 添加组件、页面或功能到项目
- `seaart generate <generator>` - 使用代码生成器快速创建代码
- `seaart upgrade` - 升级项目到最新版本

## 🛠️ 支持的模板

目前提供一个企业级标准模板：

| 模板名称 | 描述 | 特性 |
|---------|------|------|
| `default` | 海艺企业级 React Native 模板 | 完整导航、网络库、状态管理、样式系统、开发工具 |

### 模板特性详解

**🏗️ 核心架构**
- React Navigation 7 + TypeScript 类型安全导航
- 优化版 Axios + 智能缓存 + 自动重试
- TailwindCSS (twrnc) + 响应式设计
- Zustand 状态管理 + 持久化
- Expo Image + 缓存优化
- FlashList + 虚拟化高性能列表

**📱 内置组件**
- 统一导航栏组件
- 通用 UI 组件库 (Button, Input 等)
- 高阶组件 (HOC) 封装
- 错误边界组件
- 优化图片组件

**🌐 网络功能**
- 智能缓存系统 (LRU + TTL)
- 请求重试机制 (指数退避)
- 请求去重防抖
- 性能监控统计
- Token 自动管理
- 错误分类处理

**🎨 开发工具**
- TypeScript 完整支持
- ESLint + Prettier 代码规范
- 多语言国际化 (i18next)
- 主题系统配置
- 自定义 Hooks 库

> **注意**: 模板从 [yaoz0816/react-native-seaart-template](https://github.com/yaoz0816/react-native-seaart-template) 仓库动态下载，确保始终使用最新版本。

## ⚙️ 配置选项

### 创建项目选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `--template` | string | `default` | 使用的项目模板 |
| `--package-name` | string | `com.seaart.{projectname}` | 应用包名 |
| `--package-manager` | string | `pnpm` | 包管理器 (npm/yarn/pnpm) |
| `--typescript` | boolean | `true` | 启用 TypeScript |
| `--git` | boolean | `true` | 初始化 Git 仓库 |
| `--no-git` | boolean | `false` | 不初始化 Git 仓库 |
| `--skip-install` | boolean | `false` | 跳过依赖安装 |

### 环境要求

- **Node.js**: ≥18.0.0
- **pnpm**: ≥8.0.0 （推荐）
- **React Native CLI**: 最新版
- **Android Studio**: 最新版
- **Xcode**: 最新版 (仅 macOS)
- **Git**: 用于下载模版和版本控制

## 🎨 项目目录结构

创建的项目包含以下完整目录结构：

```
📱 MyAwesomeApp/
├── 🔧 配置文件
│   ├── app.json              # Expo 配置
│   ├── babel.config.js       # Babel 配置
│   ├── metro.config.js       # Metro 打包配置
│   ├── tsconfig.json         # TypeScript 配置
│   └── seaart-config.json    # 项目自定义配置
├── 📱 平台文件
│   ├── android/              # Android 原生代码
│   ├── ios/                  # iOS 原生代码
│   └── index.js             # 应用入口文件
├── 📂 源代码
│   ├── src/
│   │   ├── components/       # 通用组件
│   │   │   ├── common/      # 公共组件
│   │   │   ├── ui/          # UI 组件库
│   │   │   └── hoc/         # 高阶组件
│   │   ├── screens/         # 页面组件
│   │   ├── navigation/      # 导航配置
│   │   ├── stores/          # 状态管理 (Zustand)
│   │   ├── utils/           # 工具函数
│   │   ├── types/           # TypeScript 类型定义
│   │   ├── api/             # API 接口定义
│   │   ├── hooks/           # 自定义 Hooks
│   │   ├── locales/         # 国际化文件
│   │   ├── theme/           # 主题配置
│   │   ├── config/          # 应用配置
│   │   └── assets/          # 静态资源
├── 🛠️ 开发工具
│   ├── .eslintrc.js         # ESLint 配置
│   ├── .prettierrc.js       # Prettier 配置
│   ├── jest.config.js       # Jest 测试配置
│   └── scripts/             # 构建脚本
└── 📚 文档
    ├── README.md            # 项目说明
    ├── GETTING_STARTED.md   # 新人上手指南
    └── QUICK_REFERENCE.md   # 快速参考手册
```

## 🚀 项目内置脚本

创建项目后，您可以使用以下脚本：

```bash
# 开发相关
pnpm start                    # 启动 Metro 服务器
pnpm run android             # 运行 Android 应用
pnpm run ios                 # 运行 iOS 应用

# 代码质量
pnpm run lint                # 代码检查
pnpm run lint:fix            # 自动修复代码问题
pnpm run format              # 格式化代码
pnpm test                    # 运行测试

# 清理缓存
pnpm start --reset-cache     # 重置 Metro 缓存
pnpm run clean:android       # 清理 Android 缓存
pnpm run clean:ios           # 清理 iOS 缓存

# 项目配置
pnpm run setup               # 修改应用名称和包名
pnpm run updateI18n          # 更新国际化文件

# 构建分析
pnpm run bundle:visualizer:android  # Android 包分析
pnpm run bundle:visualizer:ios      # iOS 包分析
```

## 🔧 故障排除

### 常见问题解决方案

1. **模版下载失败**
   ```bash
   # 检查网络连接和 Git 访问权限
   git clone https://github.com/yaoz0816/react-native-seaart-template.git
   ```

2. **依赖安装失败**
   ```bash
   # 清理缓存后重新安装
   pnpm store prune
   rm -rf node_modules
   pnpm install
   ```

3. **Metro 缓存问题**
   ```bash
   # 重置 Metro 缓存
   pnpm start --reset-cache
   ```

4. **Android 构建失败**
   ```bash
   # 清理 Android 缓存
   cd android && ./gradlew clean
   cd .. && pnpm run android
   ```

5. **iOS 构建失败**
   ```bash
   # 清理 iOS 缓存和重新安装 Pods
   pnpm run clean:ios
   ```

### 获取帮助

- 📖 查看命令帮助: `seaart --help`
- 🔍 检查环境: `seaart doctor`
- 🐛 问题反馈: [GitHub Issues](https://github.com/yaoz0816/seaart-cli/issues)
- 📚 项目文档: 查看生成项目中的 `GETTING_STARTED.md`

## 📊 版本更新

```bash
# 检查当前版本
seaart --version

# 更新到最新版本
pnpm update -g @ipzero/seaart-cli

# 查看更新日志
npm info @ipzero/seaart-cli
```

## 🎯 使用示例

### 企业级项目创建

```bash
# 创建企业级项目
seaart create SeaArtMobile \
  --package-name com.seaart.mobile \
  --package-manager pnpm

# 进入项目并启动开发
cd SeaArtMobile
pnpm install
pnpm start

# 在另一个终端运行应用
pnpm run android  # 或 pnpm run ios
```

### 快速体验功能

创建项目后，您可以立即体验以下功能：

1. **🧭 导航系统** - 查看 `src/navigation/` 目录
2. **🌐 网络请求** - 查看 `src/utils/http/` 目录和示例
3. **🎨 样式系统** - 查看 `src/theme/` 和 TailwindCSS 配置
4. **📋 高性能列表** - 体验 FlashList 组件
5. **🔄 状态管理** - 查看 `src/stores/` 目录
6. **🌍 国际化** - 查看 `src/locales/` 多语言支持

## 🤝 贡献指南

我们欢迎社区贡献！请遵循以下步骤：

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/yaoz0816/seaart-cli.git
cd seaart-cli

# 安装依赖
pnpm install

# 开发模式
pnpm run dev

# 构建项目
pnpm run build

# 运行测试
pnpm test

# 本地测试 CLI
node bin/seaart create TestApp
```

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- 📱 [SeaArt 官网](https://seaart.ai)
- 📦 [NPM 包](https://www.npmjs.com/package/@ipzero/seaart-cli)
- 🐛 [问题反馈](https://github.com/yaoz0816/seaart-cli/issues)
- 📝 [更新日志](https://github.com/yaoz0816/seaart-cli/releases)
- 📚 [模版仓库](https://github.com/yaoz0816/react-native-seaart-template)
- 🎯 [使用场景详解](https://github.com/yaoz0816/react-native-seaart-template/blob/main/USE_CASES.md)

---

<div align="center">

**🎨 SeaArt Technology Team - 让创意触手可及**

[![React Native](https://img.shields.io/badge/React%20Native-0.76.9-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-52-black.svg)](https://expo.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.6-38B2AC.svg)](https://tailwindcss.com/)

> 🌟 如果这个项目对您有帮助，请给我们一个 Star！

</div> 