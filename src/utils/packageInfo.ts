import fs from 'fs-extra'
import path from 'path'

interface PackageInfo {
	name: string
	version: string
	description: string
}

export function packageInfo(): PackageInfo {
	try {
		const packageJsonPath = path.join(__dirname, '../../package.json')
		const packageJson = fs.readJsonSync(packageJsonPath)

		return {
			name: packageJson.name,
			version: packageJson.version,
			description: packageJson.description
		}
	} catch (error) {
		return {
			name: '@seaart/cli',
			version: '1.0.0',
			description: 'SeaArt React Native 项目脚手架工具'
		}
	}
}

export function getProjectPackageInfo(projectPath: string = process.cwd()): PackageInfo | null {
	try {
		const packageJsonPath = path.join(projectPath, 'package.json')
		const packageJson = fs.readJsonSync(packageJsonPath)

		return {
			name: packageJson.name,
			version: packageJson.version,
			description: packageJson.description
		}
	} catch (error) {
		return null
	}
} 