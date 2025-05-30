import chalk from 'chalk'

interface GenerateOptions {
	name?: string
	path?: string
	dryRun?: boolean
}

export async function generateCode(generator: string, options: GenerateOptions = {}) {
	console.log(chalk.blue(`\n🔧 代码生成: ${generator}\n`))

	console.log(chalk.yellow('🚧 此功能正在开发中...'))
	console.log(chalk.gray('生成器:', generator))
	console.log(chalk.gray('选项:', options))
} 