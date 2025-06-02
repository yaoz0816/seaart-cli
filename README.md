# @ipzero/seaart-cli

🎨 SeaArt React Native 项目脚手架工具

[![npm version](https://badge.fury.io/js/@ipzero%2Fseaart-cli.svg)](https://badge.fury.io/js/@ipzero%2Fseaart-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
# 创建基础项目
seaart create MyAwesomeApp

# 指定包名
seaart create MyAwesomeApp --package-name com.company.myapp

# 使用特定模板
seaart create MyAwesomeApp --template gallery

# 跳过依赖安装
seaart create MyAwesomeApp --skip-install

# 指定包管理器
seaart create MyAwesomeApp --package-manager yarn
```

### 项目创建过程

脚手架会自动执行以下步骤：
1. 📦 从 Git 仓库下载最新模版
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

# 运行 Web 应用
pnpm run web
```

## 📋 完整命令列表

### 项目创建和配置

- `seaart create <project-name>` - 创建新的 React Native 项目
- `seaart setup` - 配置现有项目的名称和包名
- `seaart doctor` - 检查开发环境和项目配置

### 代码生成（计划中）

- `seaart add <type>` - 添加组件、页面或功能到项目
- `seaart generate <generator>` - 使用代码生成器快速创建代码
- `seaart upgrade` - 升级项目到最新版本

## 🎯 使用示例

### 创建不同类型的应用

```bash
# 标准应用
seaart create MyApp

# 画廊应用
seaart create GalleryApp --template gallery

# 创作工具应用
seaart create StudioApp --template studio

# 社区应用
seaart create CommunityApp --template community

# 商城应用
seaart create MarketApp --template market

# 管理后台应用
seaart create AdminApp --template admin
```

### 企业级项目配置

```bash
seaart create SeaArtPro \
  --template default \
  --package-name com.seaart.pro \
  --package-manager pnpm \
  --no-git
```

## 🛠️ 支持的模板

| 模板名称 | 描述 | 特性 |
|---------|------|------|
| `default` | 标准 SeaArt React Native 模板 | 基础功能、导航、状态管理 |
| `gallery` | 画廊应用模板 | 图片展示、瀑布流、搜索过滤 |
| `studio` | 创作工具模板 | 画布组件、手势支持、文件系统 |
| `community` | 社区应用模板 | 用户系统、发布功能、评论系统 |
| `market` | 数字人应用模板 | 商品展示、购物车、支付集成 |
| `admin` | 管理后台模板 | 数据表格、图表组件、权限管理 |

> **注意**: 所有模板都从 [yaoz0816/seaart-cli](https://github.com/yaoz0816/seaart-cli) 仓库动态下载，确保始终使用最新版本。

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

- **Node.js**: >=18.0.0
- **npm**: >=8.0.0 或 **yarn**: >=1.22.0 或 **pnpm**: >=7.0.0
- **Git**: 用于下载模版和版本控制

## 🎨 SeaArt 开发规范

### 命名约定

- **组件**: 使用 PascalCase (例如: `UserProfile`)
- **文件**: 使用 camelCase (例如: `userProfile.tsx`)
- **常量**: 使用 UPPER_SNAKE_CASE (例如: `API_BASE_URL`)
- **函数**: 使用 camelCase (例如: `getUserProfile`)

### 项目目录结构

```
src/
├── components/         # 通用组件
│   ├── common/        # 公共组件 (ErrorBoundary, Loading)
│   └── ui/            # UI 组件 (Button, Input)
├── screens/           # 页面组件
│   ├── home/          # 首页
│   ├── explore/       # 探索页
│   ├── create/        # 创作页
│   ├── messages/      # 消息页
│   └── profile/       # 个人资料页
├── navigation/        # 导航配置
├── stores/            # 状态管理 (Zustand)
├── utils/             # 工具函数
│   └── http/          # 网络请求封装
├── types/             # TypeScript 类型定义
├── api/               # API 接口定义
├── config/            # 配置文件
├── hooks/             # 自定义 Hooks
├── assets/            # 静态资源
└── locales/           # 国际化文件
```

### 技术栈

#### 核心框架
- **React Native**: 0.74.5
- **Expo**: ~51.0.28
- **TypeScript**: 5.0.4

#### 导航和路由
- **React Navigation v6**: 栈导航和标签导航

#### 状态管理
- **Zustand**: 轻量级状态管理

#### UI 和样式
- **Expo Image**: 高性能图片组件
- **Flash List**: 高性能列表组件
- **React Native Reanimated**: 动画库
- **Tailwind CSS (twrnc)**: 样式系统

#### 网络和数据
- **Axios**: HTTP 客户端
- **AsyncStorage**: 本地存储

#### 国际化
- **i18next**: 国际化框架
- **react-i18next**: React 绑定

#### 开发工具
- **ESLint**: 代码规范检查
- **Prettier**: 代码格式化
- **Jest**: 单元测试

## 🚀 部署指南

### Android 构建

```bash
# 清理缓存
pnpm run clean:android

# 构建 Release 版本
pnpm run build

# 生成 APK
cd android && ./gradlew assembleRelease
```

### iOS 构建

```bash
# 清理缓存
pnpm run clean:ios

# 安装 Pods
cd ios && pod install

# 在 Xcode 中打开项目
open ios/MyAwesomeApp.xcworkspace
```

### Web 部署

```bash
# 构建 Web 版本
pnpm run web

# 构建生产版本
npx expo export --platform web
```

## 🔧 故障排除

### 常见问题

1. **模版下载失败**
   ```bash
   # 检查网络连接和 Git 访问权限
   git clone https://github.com/yaoz0816/seaart-cli.git
   ```

2. **依赖安装失败**
   ```bash
   # 清理缓存后重新安装
   pnpm store prune
   rm -rf node_modules
   pnpm install
   ```

3. **Android 构建失败**
   ```bash
   # 清理 Android 缓存
   cd android
   ./gradlew clean
   cd .. && pnpm run clean:android
   ```

4. **iOS 构建失败**
   ```bash
   # 清理 iOS 缓存和重新安装 Pods
   pnpm run clean:ios
   cd ios && rm -rf Pods Podfile.lock
   pod install
   ```

### 获取帮助

- 查看命令帮助: `seaart --help`
- 检查环境: `seaart doctor`
- 问题反馈: [GitHub Issues](https://github.com/yaoz0816/seaart-cli/issues)

## 📊 版本更新

```bash
# 检查当前版本
seaart --version

# 更新到最新版本
npm update -g @ipzero/seaart-cli

# 查看更新日志
npm info @ipzero/seaart-cli
```

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
```

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- 📱 [SeaArt 官网](https://seaart.ai)
- 📦 [NPM 包](https://www.npmjs.com/package/@ipzero/seaart-cli)
- 🐛 [问题反馈](https://github.com/yaoz0816/seaart-cli/issues)
- 📝 [更新日志](https://github.com/yaoz0816/seaart-cli/releases)
- 📚 [开发文档](https://github.com/yaoz0816/seaart-cli/wiki)

---

Made with ❤️ by SeaArt Technology Team

> 🌟 如果这个项目对您有帮助，请给我们一个 Star！ 