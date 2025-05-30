#!/bin/bash

# SeaArt CLI 安装脚本
# 使用方法: curl -fsSL https://raw.githubusercontent.com/seaart/cli/main/scripts/install.sh | bash

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logo
echo -e "${CYAN}"
echo "  ┌─────────────────────────────────────┐"
echo "  │  🎨 SeaArt React Native CLI        │"
echo "  │     专业的RN项目脚手架工具          │"
echo "  └─────────────────────────────────────┘"
echo -e "${NC}"

# 检测系统
OS="$(uname -s)"
ARCH="$(uname -m)"

echo -e "${BLUE}🔍 检测系统信息...${NC}"
echo "操作系统: $OS"
echo "架构: $ARCH"

# 检查 Node.js
echo -e "\n${BLUE}🔍 检查 Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未找到 Node.js${NC}"
    echo -e "${YELLOW}请先安装 Node.js (>= 18.0.0): https://nodejs.org${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "Node.js 版本: $NODE_VERSION"

# 检查 Node.js 版本
REQUIRED_VERSION="18.0.0"
if ! node -e "process.exit(require('semver').gte(process.version, '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
    echo -e "${RED}❌ Node.js 版本过低${NC}"
    echo -e "${YELLOW}当前版本: $NODE_VERSION${NC}"
    echo -e "${YELLOW}需要版本: >= $REQUIRED_VERSION${NC}"
    exit 1
fi

# 检测包管理器
echo -e "\n${BLUE}🔍 检测包管理器...${NC}"
PACKAGE_MANAGER=""

if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
    echo "找到 pnpm"
elif command -v yarn &> /dev/null; then
    PACKAGE_MANAGER="yarn"
    echo "找到 yarn"
elif command -v npm &> /dev/null; then
    PACKAGE_MANAGER="npm"
    echo "找到 npm"
else
    echo -e "${RED}❌ 未找到任何包管理器${NC}"
    exit 1
fi

echo "使用包管理器: $PACKAGE_MANAGER"

# 安装 CLI
echo -e "\n${BLUE}📦 安装 @seaart/cli...${NC}"

case $PACKAGE_MANAGER in
    "pnpm")
        pnpm add -g @seaart/cli
        ;;
    "yarn")
        yarn global add @seaart/cli
        ;;
    "npm")
        npm install -g @seaart/cli
        ;;
esac

# 验证安装
echo -e "\n${BLUE}🔍 验证安装...${NC}"
if command -v seaart &> /dev/null; then
    echo -e "${GREEN}✅ SeaArt CLI 安装成功!${NC}"
    echo ""
    seaart --version
    echo ""
    echo -e "${PURPLE}🚀 快速开始:${NC}"
    echo -e "${CYAN}  seaart create MyAwesomeApp${NC}"
    echo -e "${CYAN}  seaart setup${NC}"
    echo -e "${CYAN}  seaart --help${NC}"
    echo ""
    echo -e "${YELLOW}📖 文档: https://github.com/seaart/cli${NC}"
else
    echo -e "${RED}❌ 安装失败${NC}"
    echo -e "${YELLOW}请手动安装: $PACKAGE_MANAGER install -g @seaart/cli${NC}"
    exit 1
fi 