#!/usr/bin/env node

import chalk from 'chalk'
import { program } from 'commander'
import { addComponent } from './commands/add'
import { createProject } from './commands/create'
import { doctorCheck } from './commands/doctor'
import { generateCode } from './commands/generate'
import { setupProject } from './commands/setup'
import { upgradeProject } from './commands/upgrade'
import { packageInfo } from './utils/packageInfo'

const pkg = packageInfo()

// ASCII Art Logo
const logo = `
${chalk.cyan('  ┌─────────────────────────────────────┐')}
${chalk.cyan('  │')}  ${chalk.magenta.bold('🎨 SeaArt React Native CLI')}  ${chalk.cyan('│')}
${chalk.cyan('  │')}     ${chalk.gray('专业的RN项目脚手架工具')}     ${chalk.cyan('│')}
${chalk.cyan('  └─────────────────────────────────────┘')}
`

// 设置版本和描述
program
	.name('seaart')
	.version(pkg.version)
	.description(chalk.green('SeaArt React Native 项目脚手架工具'))
	.addHelpText('beforeAll', logo)

// create 命令 - 创建新项目
program
	.command('create <project-name>')
	.description('创建新的 React Native 项目')
	.option('-t, --template <template>', '使用指定模板', 'default')
	.option('-p, --package-name <package>', '指定应用包名')
	.option('--typescript', '使用 TypeScript (默认启用)', true)
	.option('--no-git', '不初始化 Git 仓库')
	.option('--package-manager <pm>', '指定包管理器 (npm/yarn/pnpm)', 'pnpm')
	.option('--skip-install', '跳过依赖安装')
	.action(createProject)

// setup 命令 - 配置现有项目
program
	.command('setup')
	.description('配置现有项目的名称和包名')
	.option('-n, --name <name>', '项目名称')
	.option('-p, --package <package>', '应用包名')
	.option('--interactive', '交互式配置', true)
	.action(setupProject)

// add 命令 - 添加组件和功能
program
	.command('add <type>')
	.description('添加组件、页面或功能到项目')
	.option('-n, --name <name>', '组件/页面名称')
	.option('-d, --directory <dir>', '指定目录')
	.option('--with-test', '同时生成测试文件')
	.option('--with-story', '同时生成 Storybook 文件')
	.action(addComponent)

// generate 命令 - 代码生成器
program
	.command('generate <generator>')
	.alias('g')
	.description('使用代码生成器快速创建代码')
	.option('-n, --name <name>', '名称')
	.option('-p, --path <path>', '生成路径')
	.option('--dry-run', '预览生成结果，不实际创建文件')
	.action(generateCode)

// doctor 命令 - 环境检查
program
	.command('doctor')
	.description('检查开发环境和项目配置')
	.option('--fix', '自动修复发现的问题')
	.option('--verbose', '显示详细信息')
	.action(doctorCheck)

// upgrade 命令 - 升级项目
program
	.command('upgrade')
	.description('升级项目到最新版本')
	.option('--version <version>', '升级到指定版本')
	.option('--check-only', '仅检查可用更新')
	.option('--force', '强制升级')
	.action(upgradeProject)

// info 命令 - 显示项目信息
program
	.command('info')
	.description('显示项目和环境信息')
	.action(() => {
		console.log(logo)
		console.log(chalk.yellow('🔍 项目信息:'))
		console.log(`  版本: ${pkg.version}`)
		console.log(`  Node.js: ${process.version}`)
		console.log(`  平台: ${process.platform}`)
		console.log(`  架构: ${process.arch}`)
	})

// 错误处理
program.on('command:*', () => {
	console.error(chalk.red(`未知命令: ${program.args.join(' ')}`))
	console.log(chalk.yellow('使用 --help 查看可用命令'))
	process.exit(1)
})

// 如果没有提供命令，显示帮助
if (!process.argv.slice(2).length) {
	program.outputHelp()
}

// 解析命令行参数
program.parse()

export default program 