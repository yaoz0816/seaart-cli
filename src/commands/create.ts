import chalk from 'chalk'
import { spawn } from 'child_process'
import fs from 'fs-extra'
import ora from 'ora'
import path from 'path'
import { promisify } from 'util'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const download = require('download-git-repo')
const downloadRepo = promisify(download)

interface CreateOptions {
	template?: string
	packageName?: string
	typescript?: boolean
	git?: boolean
	packageManager?: string
	skipInstall?: boolean
}

export async function createProject(projectName: string, options: CreateOptions = {}) {
	console.log(chalk.blue(`\n🚀 创建 SeaArt React Native 项目: ${chalk.bold(projectName)}\n`))

	// 验证项目名称
	if (!isValidProjectName(projectName)) {
		console.error(chalk.red('❌ 项目名称不合法'))
		process.exit(1)
	}

	// 检查目录是否已存在
	const projectPath = path.resolve(projectName)
	if (fs.existsSync(projectPath)) {
		console.error(chalk.red(`❌ 目录 ${projectName} 已存在`))
		process.exit(1)
	}

	const {
		template = 'default',
		packageName = `com.seaart.${projectName.toLowerCase()}`,
		typescript = true,
		git = true,
		packageManager = 'pnpm',
		skipInstall = false
	} = options

	try {
		// 显示配置信息
		console.log(chalk.gray('📋 项目配置:'))
		console.log(chalk.gray(`  项目名称: ${projectName}`))
		console.log(chalk.gray(`  包名: ${packageName}`))
		console.log(chalk.gray(`  模板: ${template}`))
		console.log(chalk.gray(`  TypeScript: ${typescript ? '是' : '否'}`))
		console.log(chalk.gray(`  包管理器: ${packageManager}`))
		console.log('')

		// 克隆模板
		const spinner = ora('📦 下载项目模板...').start()
		await cloneTemplate(template, projectPath, projectName)
		spinner.succeed('模板下载完成')

		// 配置项目
		spinner.text = '⚙️ 配置项目...'
		spinner.start()
		await configureProject(projectPath, projectName, packageName)
		spinner.succeed('项目配置完成')

		// 安装依赖
		if (!skipInstall) {
			spinner.text = '📚 安装依赖...'
			spinner.start()
			await installDependencies(projectPath, packageManager)
			spinner.succeed('依赖安装完成')
		}

		// 初始化 Git
		if (git) {
			spinner.text = '🔧 初始化 Git 仓库...'
			spinner.start()
			await initializeGit(projectPath)
			spinner.succeed('Git 仓库初始化完成')
		}

		// 完成提示
		console.log(chalk.green('\n✅ 项目创建成功!'))
		console.log(chalk.yellow('\n📝 下一步:'))
		console.log(chalk.gray(`  cd ${projectName}`))

		if (skipInstall) {
			console.log(chalk.gray(`  ${packageManager} install`))
		}

		console.log(chalk.gray(`  ${packageManager} run android  # 运行 Android`))
		console.log(chalk.gray(`  ${packageManager} run ios      # 运行 iOS`))
		console.log('')

	} catch (error) {
		console.error(chalk.red('❌ 创建项目失败:'), error)
		process.exit(1)
	}
}

function isValidProjectName(name: string): boolean {
	return /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name)
}

async function cloneTemplate(template: string, projectPath: string, projectName: string): Promise<void> {
	// 创建项目根目录
	await fs.ensureDir(projectPath)

	// 加载模版配置
	const configPath = path.resolve(__dirname, '../../templates/seaart-config.json')
	const config = JSON.parse(await fs.readFile(configPath, 'utf8'))

	// 获取模版信息
	const templateInfo = config.templates[template] || config.templates.default
	const repository = templateInfo.repository
	const branch = templateInfo.branch || 'main'

	console.log(chalk.blue(`📦 从 Git 仓库下载模版: ${repository}#${branch}`))

	try {
		// 从 Git 仓库下载模版
		await downloadRepo(`${repository}#${branch}`, projectPath, { clone: false })
		console.log(chalk.green('✅ 模版下载完成'))

		// 清理不需要的文件
		await cleanTemplateFiles(projectPath)

		// 更新项目配置
		await updateTemplateProject(projectPath, projectName)

	} catch (error: any) {
		console.error(chalk.red('❌ 模版下载失败:'), error.message)

		// 如果是网络错误或仓库不存在，回退到创建基础项目
		console.log(chalk.yellow('🔄 回退到创建基础项目...'))
		await createBasicProject(projectPath, projectName)
	}
}

async function cleanTemplateFiles(projectPath: string): Promise<void> {
	// 需要删除的文件和目录
	const filesToDelete = [
		'.git',
		'node_modules',
		'dist',
		'pnpm-lock.yaml',
		'yarn.lock',
		'package-lock.json',
		'.DS_Store'
	]

	for (const file of filesToDelete) {
		const filePath = path.join(projectPath, file)
		try {
			if (await fs.pathExists(filePath)) {
				await fs.remove(filePath)
				console.log(chalk.gray(`  ✓ 清理: ${file}`))
			}
		} catch (error) {
			// 忽略删除错误
		}
	}
}

async function updateTemplateProject(projectPath: string, projectName: string): Promise<void> {
	// 更新 package.json
	const packageJsonPath = path.join(projectPath, 'package.json')
	const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
	packageJson.name = projectName
	packageJson.version = '1.0.0'
	packageJson.private = true

	// 移除 CLI 相关的字段
	delete packageJson.bin
	delete packageJson.publishConfig

	await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))
	console.log(chalk.gray('  ✓ 更新 package.json'))

	// 更新 app.json
	const appJsonPath = path.join(projectPath, 'app.json')
	if (await fs.pathExists(appJsonPath)) {
		const appJson = JSON.parse(await fs.readFile(appJsonPath, 'utf8'))
		appJson.name = projectName
		appJson.displayName = projectName
		if (appJson.expo) {
			appJson.expo.name = projectName
			appJson.expo.slug = projectName.toLowerCase()
		}
		await fs.writeFile(appJsonPath, JSON.stringify(appJson, null, 2))
		console.log(chalk.gray('  ✓ 更新 app.json'))
	}

	// 如果不存在 app.json，创建一个基础的
	if (!await fs.pathExists(appJsonPath)) {
		const appJson = {
			name: projectName,
			displayName: projectName,
			expo: {
				name: projectName,
				slug: projectName.toLowerCase(),
				version: '1.0.0',
				orientation: 'portrait',
				icon: './assets/icon.png',
				userInterfaceStyle: 'light',
				splash: {
					image: './assets/splash.png',
					resizeMode: 'contain',
					backgroundColor: '#ffffff'
				},
				assetBundlePatterns: ['**/*'],
				ios: {
					supportsTablet: true
				},
				android: {
					adaptiveIcon: {
						foregroundImage: './assets/adaptive-icon.png',
						backgroundColor: '#ffffff'
					}
				},
				web: {
					favicon: './assets/favicon.png'
				}
			}
		}
		await fs.writeJson(appJsonPath, appJson, { spaces: 2 })
		console.log(chalk.gray('  ✓ 创建 app.json'))
	}

	// 确保存在 index.js
	const indexJsPath = path.join(projectPath, 'index.js')
	if (!await fs.pathExists(indexJsPath)) {
		const indexJs = `import { AppRegistry } from 'react-native';
import AppRoot from './src/AppRoot';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => AppRoot);
`
		await fs.writeFile(indexJsPath, indexJs)
		console.log(chalk.gray('  ✓ 创建 index.js'))
	}
}

async function createBasicProject(projectPath: string, projectName: string): Promise<void> {
	console.log(chalk.blue('🔨 创建基础 React Native 项目...'))

	// 创建基础模板的 package.json
	const packageJson = {
		name: projectName,
		version: '1.0.0',
		private: true,
		scripts: {
			start: 'npx react-native start --reset-cache',
			android: 'react-native run-android',
			ios: 'react-native run-ios',
			web: 'npx expo start --web',
			build: 'npx react-native build-android',
			clean: 'npx react-native clean',
			'clean:android': 'cd android && ./gradlew clean',
			'clean:ios': 'cd ios && xcodebuild clean',
			lint: 'eslint . --ext .js,.jsx,.ts,.tsx',
			'lint:fix': 'eslint . --ext .js,.jsx,.ts,.tsx --fix',
			test: 'jest',
			'test:watch': 'jest --watch',
			typecheck: 'tsc --noEmit'
		},
		dependencies: {
			'react': '18.2.0',
			'react-native': '0.74.5',
			'@react-navigation/native': '^6.1.18',
			'@react-navigation/stack': '^6.4.1',
			'@react-navigation/bottom-tabs': '^6.6.1',
			'react-native-screens': '^3.34.0',
			'react-native-safe-area-context': '^4.10.9',
			'zustand': '^4.5.5',
			'axios': '^1.7.7',
			'expo': '~51.0.28',
			'expo-image': '~1.12.15',
			'expo-linear-gradient': '~13.0.2',
			'@shopify/flash-list': '1.6.4',
			'react-native-reanimated': '^3.15.0',
			'twrnc': '^4.5.1',
			'i18next': '^23.15.1',
			'react-i18next': '^15.0.2',
			'@react-native-async-storage/async-storage': '^1.24.0'
		},
		devDependencies: {
			'@babel/core': '^7.20.0',
			'@babel/preset-env': '^7.20.0',
			'@babel/runtime': '^7.20.0',
			'@react-native/babel-preset': '0.74.87',
			'@react-native/eslint-config': '0.74.87',
			'@react-native/metro-config': '0.74.87',
			'@react-native/typescript-config': '0.74.87',
			'@types/react': '^18.2.6',
			'@types/react-test-renderer': '^18.0.0',
			'babel-jest': '^29.6.3',
			'eslint': '^8.19.0',
			'jest': '^29.6.3',
			'prettier': '2.8.8',
			'react-test-renderer': '18.2.0',
			'typescript': '5.0.4'
		},
		engines: {
			node: '>=18'
		}
	}

	await fs.writeJson(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 })

	// 创建其他基础文件
	await createBaseFiles(projectPath, projectName)

	// 创建源代码结构
	await createSrcStructure(projectPath)

	// 创建平台特定文件
	await createPlatformFiles(projectPath, projectName)
}

async function ensureAndroidExecutableFiles(projectPath: string): Promise<void> {
	try {
		const gradlewPath = path.join(projectPath, 'android/gradlew')
		const gradlewBatPath = path.join(projectPath, 'android/gradlew.bat')

		// 检查并设置 gradlew 执行权限
		if (await fs.pathExists(gradlewPath)) {
			await fs.chmod(gradlewPath, 0o755)
			console.log(chalk.gray('  ✓ 设置 gradlew 执行权限'))
		}

		// 检查并设置 gradlew.bat 权限
		if (await fs.pathExists(gradlewBatPath)) {
			await fs.chmod(gradlewBatPath, 0o755)
			console.log(chalk.gray('  ✓ 设置 gradlew.bat 执行权限'))
		}
	} catch (error: any) {
		console.log(chalk.yellow(`⚠ 设置 gradlew 权限失败: ${error.message}`))
	}
}

async function verifyAndFixAndroidFiles(projectPath: string): Promise<void> {
	console.log(chalk.blue('🔍 验证 Android 文件完整性...'))

	const cliDir = path.resolve(__dirname, '../../')
	const androidFiles = [
		'android/build.gradle',
		'android/settings.gradle',
		'android/gradle.properties',
		'android/gradlew',
		'android/gradlew.bat',
		'android/app/build.gradle',
		'android/app/proguard-rules.pro',
		'android/app/src/main/AndroidManifest.xml',
		'android/app/src/debug/AndroidManifest.xml',
		'android/app/src/main/java',
		'android/app/src/main/res',
		'android/gradle/wrapper/gradle-wrapper.properties',
		'android/gradle/wrapper/gradle-wrapper.jar'
	]

	let missingFiles = 0
	let fixedFiles = 0

	for (const file of androidFiles) {
		const targetPath = path.join(projectPath, file)
		const sourcePath = path.join(cliDir, file)

		if (!await fs.pathExists(targetPath)) {
			if (await fs.pathExists(sourcePath)) {
				try {
					await fs.copy(sourcePath, targetPath, { overwrite: true })
					console.log(chalk.green(`  ✓ 修复缺失文件: ${file}`))
					fixedFiles++
				} catch (error: any) {
					console.log(chalk.red(`  ✗ 无法修复: ${file} - ${error.message}`))
					missingFiles++
				}
			} else {
				console.log(chalk.yellow(`  ⚠ 源文件不存在: ${file}`))
				missingFiles++
			}
		} else {
			console.log(chalk.gray(`  ✓ 文件存在: ${file}`))
		}
	}

	// 设置 gradlew 权限
	const gradlewPath = path.join(projectPath, 'android/gradlew')
	if (await fs.pathExists(gradlewPath)) {
		await fs.chmod(gradlewPath, 0o755)
	}

	// 确保settings.gradle有正确的React Native和Expo配置
	await ensureAndroidSettingsConfiguration(projectPath, cliDir)

	if (fixedFiles > 0) {
		console.log(chalk.green(`✅ 修复了 ${fixedFiles} 个 Android 文件`))
	}

	if (missingFiles > 0) {
		console.log(chalk.yellow(`⚠ 仍有 ${missingFiles} 个文件缺失，可能需要手动检查`))
	} else {
		console.log(chalk.green(`✅ Android 文件验证完成，所有文件完整`))
	}
}

async function ensureAndroidSettingsConfiguration(projectPath: string, cliDir: string): Promise<void> {
	const settingsPath = path.join(projectPath, 'android/settings.gradle')
	const sourceSettingsPath = path.join(cliDir, 'android/settings.gradle')

	try {
		// 直接复制已修复的settings.gradle配置
		if (await fs.pathExists(sourceSettingsPath)) {
			await fs.copy(sourceSettingsPath, settingsPath, { overwrite: true })
			console.log(chalk.green(`  ✓ 更新 settings.gradle 配置`))
		}
	} catch (error: any) {
		console.log(chalk.yellow(`⚠ 更新 settings.gradle 失败: ${error.message}`))
	}
}

async function configureProject(projectPath: string, projectName: string, packageName: string): Promise<void> {
	// 更新 package.json
	const packageJsonPath = path.join(projectPath, 'package.json')
	if (await fs.pathExists(packageJsonPath)) {
		const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
		packageJson.name = projectName
		await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))
		console.log(chalk.gray('  ✓ 更新 package.json'))
	}

	// 更新 app.json
	const appJsonPath = path.join(projectPath, 'app.json')
	if (await fs.pathExists(appJsonPath)) {
		const appJson = JSON.parse(await fs.readFile(appJsonPath, 'utf8'))
		appJson.name = projectName
		appJson.displayName = projectName
		if (appJson.expo) {
			appJson.expo.name = projectName
			appJson.expo.slug = projectName.toLowerCase()
		}
		await fs.writeFile(appJsonPath, JSON.stringify(appJson, null, 2))
		console.log(chalk.gray('  ✓ 更新 app.json'))
	}

	// 更新 index.js 中的组件注册名称
	const indexJsPath = path.join(projectPath, 'index.js')
	if (await fs.pathExists(indexJsPath)) {
		let content = await fs.readFile(indexJsPath, 'utf8')
		// 确保使用项目名称作为组件名
		if (content.includes('import { name as appName }')) {
			// 如果使用了 app.json 中的 name，保持不变（这是推荐做法）
		} else {
			// 如果是硬编码的组件名，更新它
			content = content.replace(
				/AppRegistry\.registerComponent\('[^']*'/,
				`AppRegistry.registerComponent('${projectName}'`
			)
		}
		await fs.writeFile(indexJsPath, content)
		console.log(chalk.gray('  ✓ 更新 index.js 组件注册'))
	}

	// 更新 Android 包名
	await updateAndroidPackageName(projectPath, packageName, projectName)

	// 更新 iOS Bundle ID
	await updateIOSBundleId(projectPath, packageName, projectName)
}

async function updateAndroidPackageName(projectPath: string, packageName: string, projectName: string): Promise<void> {
	const androidPath = path.join(projectPath, 'android')
	if (!await fs.pathExists(androidPath)) {
		return
	}

	// 更新 app/build.gradle
	const buildGradlePath = path.join(androidPath, 'app/build.gradle')
	if (await fs.pathExists(buildGradlePath)) {
		let content = await fs.readFile(buildGradlePath, 'utf8')

		// 更新 namespace
		content = content.replace(/namespace\s+"[^"]*"/, `namespace "${packageName}"`)

		// 更新 applicationId
		content = content.replace(/applicationId\s+"[^"]*"/, `applicationId "${packageName}"`)

		await fs.writeFile(buildGradlePath, content)
		console.log(chalk.gray('  ✓ 更新 Android build.gradle'))
	}

	// 更新源码包名和文件路径
	const javaPath = path.join(androidPath, 'app/src/main/java')
	if (await fs.pathExists(javaPath)) {
		// 查找现有的 Java/Kotlin 文件
		const files = await findJavaKotlinFiles(javaPath)

		// 创建新的包目录结构
		const newPackagePath = path.join(javaPath, ...packageName.split('.'))
		await fs.ensureDir(newPackagePath)

		for (const file of files) {
			// 读取文件内容并更新包声明
			let content = await fs.readFile(file, 'utf8')
			const oldPackageMatch = content.match(/package\s+([a-zA-Z0-9_.]+)/)
			if (oldPackageMatch) {
				content = content.replace(/package\s+[a-zA-Z0-9_.]+/, `package ${packageName}`)

				// 如果是 MainActivity，还需要更新 getMainComponentName 方法
				if (file.includes('MainActivity')) {
					content = content.replace(
						/override fun getMainComponentName\(\): String = "[^"]*"/,
						`override fun getMainComponentName(): String = "${projectName}"`
					)
					console.log(chalk.gray(`  ✓ 更新 MainActivity 组件名称: ${projectName}`))
				}

				// 移动文件到新的包目录
				const fileName = path.basename(file)
				const newFilePath = path.join(newPackagePath, fileName)
				await fs.writeFile(newFilePath, content)
				console.log(chalk.gray(`  ✓ 更新并移动: ${fileName}`))
			}
		}

		// 完全清理旧的包目录结构
		await cleanupOldPackageDirectories(javaPath, packageName)
	}

	// 更新 strings.xml 中的应用名称
	const stringsXmlPath = path.join(androidPath, 'app/src/main/res/values/strings.xml')
	if (await fs.pathExists(stringsXmlPath)) {
		let content = await fs.readFile(stringsXmlPath, 'utf8')
		content = content.replace(/<string name="app_name">[^<]*<\/string>/, `<string name="app_name">${projectName}</string>`)
		await fs.writeFile(stringsXmlPath, content)
		console.log(chalk.gray('  ✓ 更新 Android strings.xml'))
	}
}

async function findJavaKotlinFiles(dir: string): Promise<string[]> {
	const files: string[] = []

	async function searchDir(currentDir: string) {
		const items = await fs.readdir(currentDir)
		for (const item of items) {
			const fullPath = path.join(currentDir, item)
			const stat = await fs.stat(fullPath)
			if (stat.isDirectory()) {
				await searchDir(fullPath)
			} else if (/\.(java|kt)$/.test(item)) {
				files.push(fullPath)
			}
		}
	}

	await searchDir(dir)
	return files
}

async function cleanupOldPackageDirectories(javaPath: string, newPackageName: string): Promise<void> {
	try {
		const newPackageParts = newPackageName.split('.')

		// 递归清理所有不匹配新包名的目录
		async function cleanupRecursive(currentPath: string, depth: number) {
			if (depth >= newPackageParts.length) {
				return
			}

			const items = await fs.readdir(currentPath)
			for (const item of items) {
				const itemPath = path.join(currentPath, item)
				const stat = await fs.stat(itemPath)

				if (stat.isDirectory()) {
					// 如果这个目录不是新包名路径的一部分，删除它
					if (item !== newPackageParts[depth]) {
						await fs.remove(itemPath)
						console.log(chalk.gray(`  ✓ 清理旧目录: ${path.relative(javaPath, itemPath)}`))
					} else {
						// 如果是新包名路径的一部分，继续深入清理
						await cleanupRecursive(itemPath, depth + 1)
					}
				}
			}
		}

		await cleanupRecursive(javaPath, 0)
	} catch (error) {
		// 忽略清理错误
		console.log(chalk.gray(`  ⚠ 清理旧目录时出现错误: ${error}`))
	}
}

async function updateIOSBundleId(projectPath: string, packageName: string, projectName: string): Promise<void> {
	const iosPath = path.join(projectPath, 'ios')
	if (!await fs.pathExists(iosPath)) {
		return
	}

	// 查找 .xcodeproj 文件
	const iosItems = await fs.readdir(iosPath)
	const xcodeprojDir = iosItems.find(item => item.endsWith('.xcodeproj'))

	if (xcodeprojDir) {
		const pbxprojPath = path.join(iosPath, xcodeprojDir, 'project.pbxproj')
		if (await fs.pathExists(pbxprojPath)) {
			let content = await fs.readFile(pbxprojPath, 'utf8')

			// 更新所有 PRODUCT_BUNDLE_IDENTIFIER 配置，包括特殊的 SDK 配置
			content = content.replace(/PRODUCT_BUNDLE_IDENTIFIER = [^;]+;/g, `PRODUCT_BUNDLE_IDENTIFIER = ${packageName};`)
			content = content.replace(/"PRODUCT_BUNDLE_IDENTIFIER\[sdk=iphoneos\*\]" = [^;]+;/g, `"PRODUCT_BUNDLE_IDENTIFIER[sdk=iphoneos*]" = ${packageName};`)

			await fs.writeFile(pbxprojPath, content)
			console.log(chalk.gray('  ✓ 更新 iOS Bundle ID'))
		}
	}

	// 更新 Info.plist 中的显示名称
	const infoPlistPaths = [
		path.join(iosPath, projectName, 'Info.plist'),
		path.join(iosPath, `${projectName}/Info.plist`)
	]

	for (const infoPlistPath of infoPlistPaths) {
		if (await fs.pathExists(infoPlistPath)) {
			let content = await fs.readFile(infoPlistPath, 'utf8')
			content = content.replace(/<key>CFBundleDisplayName<\/key>\s*<string>[^<]*<\/string>/, `<key>CFBundleDisplayName</key>\n\t<string>${projectName}</string>`)
			await fs.writeFile(infoPlistPath, content)
			console.log(chalk.gray('  ✓ 更新 iOS Info.plist'))
			break
		}
	}
}

async function createBaseFiles(projectPath: string, projectName: string): Promise<void> {
	// app.json
	const appJson = {
		name: projectName,
		displayName: projectName,
		expo: {
			name: projectName,
			slug: projectName.toLowerCase(),
			version: '1.0.0',
			orientation: 'portrait',
			icon: './assets/icon.png',
			userInterfaceStyle: 'light',
			splash: {
				image: './assets/splash.png',
				resizeMode: 'contain',
				backgroundColor: '#ffffff'
			},
			assetBundlePatterns: ['**/*'],
			ios: {
				supportsTablet: true
			},
			android: {
				adaptiveIcon: {
					foregroundImage: './assets/adaptive-icon.png',
					backgroundColor: '#ffffff'
				}
			},
			web: {
				favicon: './assets/favicon.png'
			}
		}
	}
	await fs.writeJson(path.join(projectPath, 'app.json'), appJson, { spaces: 2 })

	// metro.config.js
	const metroConfig = `const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
`
	await fs.writeFile(path.join(projectPath, 'metro.config.js'), metroConfig)

	// babel.config.js
	const babelConfig = `module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
  ],
};
`
	await fs.writeFile(path.join(projectPath, 'babel.config.js'), babelConfig)

	// tsconfig.json
	const tsConfig = {
		extends: '@react-native/typescript-config/tsconfig.json',
		compilerOptions: {
			allowSyntheticDefaultImports: true,
			esModuleInterop: true,
			isolatedModules: true,
			jsx: 'react-native',
			lib: ['es2017'],
			moduleResolution: 'node',
			noEmit: true,
			strict: true,
			target: 'esnext',
			resolveJsonModule: true,
			skipLibCheck: true,
			baseUrl: '.',
			paths: {
				'@/*': ['src/*'],
				'@/components/*': ['src/components/*'],
				'@/screens/*': ['src/screens/*'],
				'@/utils/*': ['src/utils/*'],
				'@/stores/*': ['src/stores/*'],
				'@/types/*': ['src/types/*']
			}
		},
		include: ['src/**/*', 'index.js'],
		exclude: ['node_modules', 'dist', 'android', 'ios']
	}
	await fs.writeJson(path.join(projectPath, 'tsconfig.json'), tsConfig, { spaces: 2 })

	// .gitignore
	const gitignore = `# React Native
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Xcode
build/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata
*.xccheckout
*.moved-aside
DerivedData
*.hmap
*.ipa
*.xcuserstate
ios/.xcode.env.local

# Android/IntelliJ
build/
.idea
.gradle
local.properties
*.iml
*.hprof
.cxx/
*.keystore
!debug.keystore

# Metro
.metro-health-check*

# CocoaPods
ios/Pods/

# Expo
.expo/
web-build/
dist/

# Debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Bundle artifacts
*.jsbundle

# Watchman
.watchmanconfig

# Test coverage
coverage/
`
	await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore)

	// index.js
	const indexJs = `import { AppRegistry } from 'react-native';
import AppRoot from './src/AppRoot';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => AppRoot);
`
	await fs.writeFile(path.join(projectPath, 'index.js'), indexJs)
}

async function createSrcStructure(projectPath: string): Promise<void> {
	const srcPath = path.join(projectPath, 'src')
	await fs.ensureDir(srcPath)

	// AppRoot.tsx
	const appRootTsx = `/**
 * @filename AppRoot.tsx
 * @description 应用根组件
 */

import React from 'react'
import { StatusBar } from 'react-native'
import ErrorBoundary from './components/common/ErrorBoundary'
import { StoreProvider } from './stores/StoreProvider'
import { RootNavigator } from './navigation'

const AppRoot: React.FC = () => {
	return (
		<ErrorBoundary>
			<StoreProvider>
				<StatusBar 
					barStyle="dark-content" 
					backgroundColor="transparent" 
					translucent 
				/>
				<RootNavigator />
			</StoreProvider>
		</ErrorBoundary>
	)
}

export default AppRoot
`
	await fs.writeFile(path.join(srcPath, 'AppRoot.tsx'), appRootTsx)

	// 创建目录结构
	const directories = [
		'components/common',
		'components/ui',
		'navigation',
		'screens/home',
		'screens/explore',
		'screens/create',
		'screens/messages',
		'screens/profile',
		'screens/settings',
		'stores',
		'utils/http',
		'types',
		'api',
		'config',
		'hooks',
		'assets',
		'locales'
	]

	for (const dir of directories) {
		await fs.ensureDir(path.join(srcPath, dir))
	}

	// 创建关键文件
	await createNavigationFiles(srcPath)
	await createComponentFiles(srcPath)
	await createStoreFiles(srcPath)
	await createUtilFiles(srcPath)
	await createScreenFiles(srcPath)
}

async function createNavigationFiles(srcPath: string): Promise<void> {
	const navPath = path.join(srcPath, 'navigation')

	// navigation/index.ts
	const indexContent = `export { RootNavigator } from './RootNavigator'
export { TabNavigator } from './TabNavigator'
export * from './types'
`
	await fs.writeFile(path.join(navPath, 'index.ts'), indexContent)

	// navigation/types.ts
	const typesContent = `import type { NavigatorScreenParams } from '@react-navigation/native'
import type { StackScreenProps } from '@react-navigation/stack'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'

export type RootStackParamList = {
	MainTabs: NavigatorScreenParams<TabParamList>
	Profile: undefined
	Settings: undefined
}

export type TabParamList = {
	Home: undefined
	Explore: undefined
	Create: undefined
	Messages: undefined
	Profile: undefined
}

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
	StackScreenProps<RootStackParamList, T>

export type TabScreenProps<T extends keyof TabParamList> = 
	BottomTabScreenProps<TabParamList, T>

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}
`
	await fs.writeFile(path.join(navPath, 'types.ts'), typesContent)

	// navigation/RootNavigator.tsx
	const rootNavContent = `import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import type { RootStackParamList } from './types'
import { TabNavigator } from './TabNavigator'
import ProfileScreen from '../screens/profile/ProfileScreen'
import SettingsScreen from '../screens/settings/SettingsScreen'

const Stack = createStackNavigator<RootStackParamList>()

export const RootNavigator: React.FC = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator 
				initialRouteName="MainTabs"
				screenOptions={{ headerShown: false }}
			>
				<Stack.Screen name="MainTabs" component={TabNavigator} />
				<Stack.Screen 
					name="Profile" 
					component={ProfileScreen}
					options={{ headerShown: true, title: '个人资料' }}
				/>
				<Stack.Screen 
					name="Settings" 
					component={SettingsScreen}
					options={{ headerShown: true, title: '设置' }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	)
}
`
	await fs.writeFile(path.join(navPath, 'RootNavigator.tsx'), rootNavContent)

	// navigation/TabNavigator.tsx
	const tabNavContent = `import React from 'react'
import { Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { TabParamList } from './types'
import HomeScreen from '../screens/home/HomeScreen'
import ExploreScreen from '../screens/explore/ExploreScreen'
import CreateScreen from '../screens/create/CreateScreen'
import MessagesScreen from '../screens/messages/MessagesScreen'
import ProfileScreen from '../screens/profile/ProfileScreen'

const Tab = createBottomTabNavigator<TabParamList>()

export const TabNavigator: React.FC = () => {
	return (
		<Tab.Navigator
			initialRouteName="Home"
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: '#007AFF',
				tabBarInactiveTintColor: '#8E8E93',
			}}
		>
			<Tab.Screen 
				name="Home" 
				component={HomeScreen}
				options={{
					title: '首页',
					tabBarIcon: ({ color, size }) => (
						<Text style={{ color, fontSize: size }}>🏠</Text>
					),
				}}
			/>
			<Tab.Screen 
				name="Explore" 
				component={ExploreScreen}
				options={{
					title: '探索',
					tabBarIcon: ({ color, size }) => (
						<Text style={{ color, fontSize: size }}>🔍</Text>
					),
				}}
			/>
			<Tab.Screen 
				name="Create" 
				component={CreateScreen}
				options={{
					title: '创作',
					tabBarIcon: ({ color, size }) => (
						<Text style={{ color, fontSize: size }}>➕</Text>
					),
				}}
			/>
			<Tab.Screen 
				name="Messages" 
				component={MessagesScreen}
				options={{
					title: '消息',
					tabBarIcon: ({ color, size }) => (
						<Text style={{ color, fontSize: size }}>💬</Text>
					),
				}}
			/>
			<Tab.Screen 
				name="Profile" 
				component={ProfileScreen}
				options={{
					title: '我的',
					tabBarIcon: ({ color, size }) => (
						<Text style={{ color, fontSize: size }}>👤</Text>
					),
				}}
			/>
		</Tab.Navigator>
	)
}
`
	await fs.writeFile(path.join(navPath, 'TabNavigator.tsx'), tabNavContent)
}

async function createComponentFiles(srcPath: string): Promise<void> {
	// ErrorBoundary
	const errorBoundaryContent = `import React, { Component, ReactNode } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

interface Props {
	children: ReactNode
}

interface State {
	hasError: boolean
	error?: Error
}

class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: any) {
		console.error('ErrorBoundary caught an error:', error, errorInfo)
	}

	handleRetry = () => {
		this.setState({ hasError: false, error: undefined })
	}

	render() {
		if (this.state.hasError) {
			return (
				<View style={styles.container}>
					<Text style={styles.title}>出错了</Text>
					<Text style={styles.message}>
						抱歉，应用出现了错误。请重试或重启应用。
					</Text>
					<TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
						<Text style={styles.retryText}>重试</Text>
					</TouchableOpacity>
				</View>
			)
		}

		return this.props.children
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#f5f5f5',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 16,
	},
	message: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		marginBottom: 24,
		lineHeight: 24,
	},
	retryButton: {
		backgroundColor: '#007AFF',
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
	},
	retryText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
})

export default ErrorBoundary
`
	await fs.writeFile(path.join(srcPath, 'components/common/ErrorBoundary.tsx'), errorBoundaryContent)
}

async function createStoreFiles(srcPath: string): Promise<void> {
	// StoreProvider
	const storeProviderContent = `import React from 'react'

interface StoreProviderProps {
	children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps): React.JSX.Element {
	return <>{children}</>
}
`
	await fs.writeFile(path.join(srcPath, 'stores/StoreProvider.tsx'), storeProviderContent)

	// User Store
	const userStoreContent = `import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface User {
	id: string
	name: string
	email: string
	avatar?: string
}

interface UserState {
	user: User | null
	isLoggedIn: boolean
	isLoading: boolean
	
	setUser: (user: User) => void
	logout: () => void
	setLoading: (loading: boolean) => void
}

export const useUserStore = create<UserState>()(
	persist(
		(set, get) => ({
			user: null,
			isLoggedIn: false,
			isLoading: false,

			setUser: (user: User) => {
				set({ user, isLoggedIn: true, isLoading: false })
			},

			logout: () => {
				set({ user: null, isLoggedIn: false, isLoading: false })
			},

			setLoading: (loading: boolean) => {
				set({ isLoading: loading })
			},
		}),
		{
			name: 'user-storage',
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
)
`
	await fs.writeFile(path.join(srcPath, 'stores/useUserStore.ts'), userStoreContent)
}

async function createUtilFiles(srcPath: string): Promise<void> {
	// HTTP Client
	const httpClientContent = `import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

class HttpClient {
	private instance: AxiosInstance

	constructor() {
		this.instance = axios.create({
			baseURL: 'https://api.seaart.com',
			timeout: 10000,
		})

		this.setupInterceptors()
	}

	private setupInterceptors() {
		this.instance.interceptors.request.use(
			(config) => {
				console.log(\`[HTTP] \${config.method?.toUpperCase()} \${config.url}\`)
				return config
			},
			(error) => {
				console.error('[HTTP] Request Error:', error)
				return Promise.reject(error)
			}
		)

		this.instance.interceptors.response.use(
			(response) => response,
			(error) => {
				console.error('[HTTP] Response Error:', error)
				return Promise.reject(error)
			}
		)
	}

	get<T = any>(url: string, config?: AxiosRequestConfig) {
		return this.instance.get<T>(url, config)
	}

	post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
		return this.instance.post<T>(url, data, config)
	}

	put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
		return this.instance.put<T>(url, data, config)
	}

	delete<T = any>(url: string, config?: AxiosRequestConfig) {
		return this.instance.delete<T>(url, config)
	}
}

export const httpClient = new HttpClient()
`
	await fs.writeFile(path.join(srcPath, 'utils/http/client.ts'), httpClientContent)

	// Constants
	const constantsContent = `export const API_CONFIG = {
	BASE_URL: 'https://api.seaart.com',
	TIMEOUT: 10000,
	RETRY_TIMES: 3,
} as const

export const COLORS = {
	PRIMARY: '#007AFF',
	SECONDARY: '#8E8E93',
	SUCCESS: '#4CD964',
	WARNING: '#FF9500',
	ERROR: '#FF3B30',
	WHITE: '#FFFFFF',
	BLACK: '#000000',
} as const
`
	await fs.writeFile(path.join(srcPath, 'utils/constants.ts'), constantsContent)
}

async function createScreenFiles(srcPath: string): Promise<void> {
	// HomeScreen
	const homeScreenContent = `import React from 'react'
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

function HomeScreen(): React.JSX.Element {
	const navigation = useNavigation()

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView}>
				<View style={styles.content}>
					<Text style={styles.title}>🎨 SeaArt</Text>
					<Text style={styles.subtitle}>欢迎使用 SeaArt 应用</Text>
					
					<View style={styles.card}>
						<Text style={styles.cardTitle}>✨ 功能特性</Text>
						<Text style={styles.feature}>• 完整的导航系统</Text>
						<Text style={styles.feature}>• TypeScript 支持</Text>
						<Text style={styles.feature}>• 状态管理 (Zustand)</Text>
						<Text style={styles.feature}>• 网络请求封装</Text>
						<Text style={styles.feature}>• 错误边界处理</Text>
					</View>

					<TouchableOpacity 
						style={styles.button}
						onPress={() => navigation.navigate('Profile' as never)}
					>
						<Text style={styles.buttonText}>查看个人资料</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	scrollView: {
		flex: 1,
	},
	content: {
		padding: 20,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#333333',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 18,
		textAlign: 'center',
		color: '#666666',
		marginBottom: 40,
	},
	card: {
		backgroundColor: '#f8f9fa',
		padding: 24,
		borderRadius: 16,
		marginBottom: 30,
		borderWidth: 1,
		borderColor: '#e9ecef',
	},
	cardTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: '#333333',
		marginBottom: 16,
	},
	feature: {
		fontSize: 16,
		color: '#495057',
		marginBottom: 8,
		lineHeight: 24,
	},
	button: {
		backgroundColor: '#007AFF',
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 12,
		alignItems: 'center',
	},
	buttonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '600',
	},
})

export default HomeScreen
`
	await fs.writeFile(path.join(srcPath, 'screens/home/HomeScreen.tsx'), homeScreenContent)

	// 创建其他屏幕
	const screens = [
		{ dir: 'explore', name: 'ExploreScreen', title: '探索' },
		{ dir: 'create', name: 'CreateScreen', title: '创作' },
		{ dir: 'messages', name: 'MessagesScreen', title: '消息' },
		{ dir: 'profile', name: 'ProfileScreen', title: '个人资料' },
		{ dir: 'settings', name: 'SettingsScreen', title: '设置' },
	]

	for (const screen of screens) {
		const screenContent = `import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

function ${screen.name}(): React.JSX.Element {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>${screen.title}</Text>
			<Text style={styles.subtitle}>这是${screen.title}页面</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333333',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: '#666666',
		textAlign: 'center',
	},
})

export default ${screen.name}
`

		await fs.writeFile(path.join(srcPath, `screens/${screen.dir}/${screen.name}.tsx`), screenContent)
	}
}

async function createPlatformFiles(projectPath: string, projectName: string): Promise<void> {
	// Android 文件
	const androidPath = path.join(projectPath, 'android')
	await fs.ensureDir(path.join(androidPath, 'app/src/main/java/com/seaart/app'))
	await fs.ensureDir(path.join(androidPath, 'app/src/main/res/values'))

	const buildGradle = `apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"

android {
    namespace "com.seaart.app"
    compileSdk 34

    defaultConfig {
        applicationId "com.seaart.app"
        minSdk 23
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation "com.facebook.react:react-native:+"
    implementation "androidx.appcompat:appcompat:1.6.1"
}
`
	await fs.writeFile(path.join(androidPath, 'app/build.gradle'), buildGradle)

	// Android 根级 build.gradle (修复版本)
	const rootBuildGradle = `buildscript {
    ext {
        buildToolsVersion = "35.0.0"
        minSdkVersion = 24
        compileSdkVersion = 35
        targetSdkVersion = 34
        ndkVersion = "26.1.10909125"
        kotlinVersion = "1.9.25"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin")
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://www.jitpack.io' }
        // React Native 相关仓库
        maven { url("\${rootDir}/../node_modules/@react-native/gradle-plugin/android/dist") }
        maven { url("\${rootDir}/../node_modules/react-native/android") }
    }
}

apply plugin: "com.facebook.react.rootproject"
`
	await fs.writeFile(path.join(androidPath, 'build.gradle'), rootBuildGradle)

	const stringsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">SeaArt App</string>
</resources>
`
	await fs.writeFile(path.join(androidPath, 'app/src/main/res/values/strings.xml'), stringsXml)

	const mainActivity = `package com.seaart.app

import com.facebook.react.ReactActivity

class MainActivity : ReactActivity() {
    override fun getMainComponentName(): String = "SeaArtApp"
}
`
	await fs.writeFile(path.join(androidPath, 'app/src/main/java/com/seaart/app/MainActivity.kt'), mainActivity)

	// iOS 文件
	const iosPath = path.join(projectPath, 'ios')
	await fs.ensureDir(path.join(iosPath, projectName))

	const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDevelopmentRegion</key>
	<string>en</string>
	<key>CFBundleDisplayName</key>
	<string>SeaArt App</string>
	<key>CFBundleExecutable</key>
	<string>$(EXECUTABLE_NAME)</string>
	<key>CFBundleIdentifier</key>
	<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
	<key>CFBundleName</key>
	<string>$(PRODUCT_NAME)</string>
	<key>CFBundlePackageType</key>
	<string>APPL</string>
	<key>CFBundleShortVersionString</key>
	<string>1.0</string>
	<key>CFBundleVersion</key>
	<string>1</string>
	<key>LSRequiresIPhoneOS</key>
	<true/>
	<key>UIRequiredDeviceCapabilities</key>
	<array>
		<string>armv7</string>
	</array>
	<key>UISupportedInterfaceOrientations</key>
	<array>
		<string>UIInterfaceOrientationPortrait</string>
		<string>UIInterfaceOrientationLandscapeLeft</string>
		<string>UIInterfaceOrientationLandscapeRight</string>
	</array>
</dict>
</plist>
`
	await fs.writeFile(path.join(iosPath, projectName, 'Info.plist'), infoPlist)

	// Assets 目录
	const assetsPath = path.join(projectPath, 'assets')
	await fs.ensureDir(assetsPath)

	const assetsReadme = `# Assets 目录

这个目录用于存放应用的静态资源文件：

- icon.png - 应用图标
- splash.png - 启动画面
- adaptive-icon.png - Android 自适应图标
- favicon.png - Web 应用图标

请替换这些占位符文件为你的实际应用资源。
`
	await fs.writeFile(path.join(assetsPath, 'README.md'), assetsReadme)
}

async function installDependencies(projectPath: string, packageManager: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const child = spawn(packageManager, ['install'], {
			cwd: projectPath,
			stdio: 'pipe'
		})

		child.on('close', (code) => {
			if (code === 0) {
				resolve()
			} else {
				reject(new Error(`依赖安装失败，退出码: ${code}`))
			}
		})

		child.on('error', reject)
	})
}

async function initializeGit(projectPath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const child = spawn('git', ['init'], {
			cwd: projectPath,
			stdio: 'pipe'
		})

		child.on('close', (code) => {
			if (code === 0) {
				resolve()
			} else {
				reject(new Error(`Git 初始化失败，退出码: ${code}`))
			}
		})

		child.on('error', reject)
	})
} 