import chalk from 'chalk'

interface AddOptions {
	name?: string
	directory?: string
	withTest?: boolean
	withStory?: boolean
}

export async function addComponent(type: string, options: AddOptions = {}) {
	console.log(chalk.blue(`\n📦 添加 ${type} 到项目\n`))

	// 基础实现，后续可以扩展
	console.log(chalk.yellow('🚧 此功能正在开发中...'))
	console.log(chalk.gray(`类型: ${type}`))
	console.log(chalk.gray(`选项:`, options))
} 