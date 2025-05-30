# @seaart/cli

🎨 SeaArt React Native 项目脚手架工具

## 📦 安装

```bash
# 全局安装
npm install -g @seaart/cli

# 或使用 yarn
yarn global add @seaart/cli

# 或使用 pnpm
pnpm add -g @seaart/cli
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
```

### 配置现有项目

```bash
# 交互式配置
seaart setup

# 直接指定参数
seaart setup --name MyApp --package com.company.myapp
```

## 📋 完整命令列表

### 项目创建和配置

- `seaart create <project-name>` - 创建新的 React Native 项目
- `seaart setup` - 配置现有项目的名称和包名
- `seaart info` - 显示项目和环境信息

### 代码生成

- `seaart add <type>` - 添加组件、页面或功能到项目
- `seaart generate <generator>` - 使用代码生成器快速创建代码

### 项目维护

- `seaart doctor` - 检查开发环境和项目配置
- `seaart upgrade` - 升级项目到最新版本

## 🎯 使用示例

### 创建画廊应用

```bash
seaart create SeaArtGallery \
  --template gallery \
  --package-name com.seaart.gallery \
  --package-manager pnpm
```

### 添加新页面

```bash
seaart add screen --name Profile --with-test
```

### 生成网络服务

```bash
seaart generate service --name UserService --path src/services
```

### 环境检查

```bash
seaart doctor --verbose --fix
```

## 🛠️ 支持的模板

- `default` - 标准 SeaArt React Native 模板
- `gallery` - 画廊应用模板
- `studio` - 创作工具模板
- `community` - 社区应用模板
- `market` - 商城应用模板
- `admin` - 管理后台模板

## ⚙️ 配置选项

### 创建项目选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `--template` | string | `default` | 使用的项目模板 |
| `--package-name` | string | `com.seaart.{projectname}` | 应用包名 |
| `--package-manager` | string | `pnpm` | 包管理器 (npm/yarn/pnpm) |
| `--typescript` | boolean | `true` | 启用 TypeScript |
| `--no-git` | boolean | `false` | 不初始化 Git 仓库 |
| `--skip-install` | boolean | `false` | 跳过依赖安装 |

### 代码生成选项

| 选项 | 类型 | 描述 |
|------|------|------|
| `--name` | string | 组件/文件名称 |
| `--path` | string | 生成路径 |
| `--with-test` | boolean | 同时生成测试文件 |
| `--with-story` | boolean | 同时生成 Storybook 文件 |
| `--dry-run` | boolean | 预览生成结果，不实际创建文件 |

## 🎨 SeaArt 开发规范

### 命名约定

- **组件**: 使用 PascalCase (e.g., `UserProfile`)
- **文件**: 使用 camelCase (e.g., `userProfile.tsx`)
- **常量**: 使用 UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **函数**: 使用 camelCase (e.g., `getUserProfile`)

### 目录结构

```
src/
├── components/     # 通用组件
├── screens/        # 页面组件
├── navigation/     # 导航配置
├── utils/          # 工具函数
├── services/       # 网络服务
├── stores/         # 状态管理
├── types/          # 类型定义
└── locales/        # 国际化文件
```

### 技术栈

- **UI**: Expo Image, Flash List, Reanimated
- **状态管理**: Zustand
- **网络**: Axios (封装)
- **国际化**: i18next
- **样式**: Tailwind CSS (twrnc)
- **导航**: React Navigation v6

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- [SeaArt 官网](https://seaart.ai)
- [问题反馈](https://github.com/seaart/cli/issues)
- [更新日志](https://github.com/seaart/cli/releases)

---

Made with ❤️ by SeaArt Technology Team 