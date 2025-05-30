#!/bin/bash

# SeaArt CLI 构建脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔨 构建 SeaArt CLI${NC}"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未找到 Node.js${NC}"
    exit 1
fi

# 进入 CLI 目录
cd packages/seaart-cli

# 安装依赖
echo -e "${BLUE}📦 安装依赖...${NC}"
pnpm install

# 编译 TypeScript
echo -e "${BLUE}🔧 编译 TypeScript...${NC}"
pnpm run build

# 检查编译结果
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ 编译失败${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 编译成功${NC}"

# 创建本地链接 (可选)
if [ "$1" = "--link" ]; then
    echo -e "${BLUE}🔗 创建本地链接...${NC}"
    npm link
    echo -e "${GREEN}✅ 本地链接创建成功${NC}"
    echo -e "${YELLOW}现在可以使用 'seaart' 命令进行测试${NC}"
fi

# 运行测试 (如果存在)
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    echo -e "${BLUE}🧪 运行测试...${NC}"
    pnpm test
fi

echo -e "${GREEN}🎉 构建完成!${NC}"

# 显示使用说明
echo -e "\n${YELLOW}📝 下一步:${NC}"
echo -e "  ${BLUE}测试:${NC} ./scripts/build.sh --link"
echo -e "  ${BLUE}发布:${NC} npm publish"
echo -e "  ${BLUE}文档:${NC} 查看 README.md" 