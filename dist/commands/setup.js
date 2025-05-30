"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupProject = setupProject;
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const inquirer_1 = __importDefault(require("inquirer"));
const path_1 = __importDefault(require("path"));
async function setupProject(options = {}) {
    console.log(chalk_1.default.blue('\n⚙️ 配置 SeaArt React Native 项目\n'));
    const projectPath = process.cwd();
    // 检查是否是有效的 React Native 项目
    if (!isReactNativeProject(projectPath)) {
        console.error(chalk_1.default.red('❌ 当前目录不是有效的 React Native 项目'));
        process.exit(1);
    }
    let { name, package: packageName, interactive = true } = options;
    // 如果是交互模式且未提供参数，则询问用户
    if (interactive && (!name || !packageName)) {
        const answers = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: '项目名称:',
                default: name || path_1.default.basename(projectPath),
                validate: (input) => {
                    if (!input.trim())
                        return '项目名称不能为空';
                    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(input)) {
                        return '项目名称只能包含字母、数字、下划线和连字符，且必须以字母开头';
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'packageName',
                message: '应用包名:',
                default: packageName || `com.seaart.${(name || path_1.default.basename(projectPath)).toLowerCase()}`,
                validate: (input) => {
                    if (!input.trim())
                        return '包名不能为空';
                    if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/.test(input)) {
                        return '包名格式不正确，应该类似: com.company.appname';
                    }
                    return true;
                }
            }
        ]);
        name = answers.projectName;
        packageName = answers.packageName;
    }
    if (!name || !packageName) {
        console.error(chalk_1.default.red('❌ 必须提供项目名称和包名'));
        process.exit(1);
    }
    try {
        console.log(chalk_1.default.gray('📋 配置信息:'));
        console.log(chalk_1.default.gray(`  项目名称: ${name}`));
        console.log(chalk_1.default.gray(`  包名: ${packageName}`));
        console.log('');
        // 更新 package.json
        updatePackageJson(projectPath, name);
        console.log(chalk_1.default.green('✅ 已更新 package.json'));
        // 更新 app.json
        updateAppJson(projectPath, name);
        console.log(chalk_1.default.green('✅ 已更新 app.json'));
        // 更新 Android 配置
        updateAndroidConfig(projectPath, packageName, name);
        console.log(chalk_1.default.green('✅ 已更新 Android 配置'));
        // 更新 iOS 配置
        updateIOSConfig(projectPath, name);
        console.log(chalk_1.default.green('✅ 已更新 iOS 配置'));
        console.log(chalk_1.default.green('\n🎉 项目配置完成!'));
        console.log(chalk_1.default.yellow('⚠️  请注意: 如果修改了包名，建议清理构建缓存'));
        console.log(chalk_1.default.gray('  npm run clean:android'));
        console.log(chalk_1.default.gray('  npm run clean:ios'));
    }
    catch (error) {
        console.error(chalk_1.default.red('❌ 配置失败:'), error);
        process.exit(1);
    }
}
function isReactNativeProject(projectPath) {
    const packageJsonPath = path_1.default.join(projectPath, 'package.json');
    if (!fs_1.default.existsSync(packageJsonPath))
        return false;
    try {
        const packageJson = JSON.parse(fs_1.default.readFileSync(packageJsonPath, 'utf8'));
        return packageJson.dependencies?.['react-native'] ||
            packageJson.devDependencies?.['react-native'] ||
            packageJson.peerDependencies?.['react-native'];
    }
    catch {
        return false;
    }
}
function updatePackageJson(projectPath, name) {
    const packageJsonPath = path_1.default.join(projectPath, 'package.json');
    const packageJson = JSON.parse(fs_1.default.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = name;
    fs_1.default.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}
function updateAppJson(projectPath, name) {
    const appJsonPath = path_1.default.join(projectPath, 'app.json');
    let appJson = {};
    if (fs_1.default.existsSync(appJsonPath)) {
        appJson = JSON.parse(fs_1.default.readFileSync(appJsonPath, 'utf8'));
    }
    appJson.name = name;
    appJson.displayName = name;
    fs_1.default.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
}
function updateAndroidConfig(projectPath, packageName, name) {
    // 更新 build.gradle
    const buildGradlePath = path_1.default.join(projectPath, 'android/app/build.gradle');
    if (fs_1.default.existsSync(buildGradlePath)) {
        let content = fs_1.default.readFileSync(buildGradlePath, 'utf8');
        content = content.replace(/namespace\s+"[^"]+"/g, `namespace "${packageName}"`);
        content = content.replace(/applicationId\s+"[^"]+"/g, `applicationId "${packageName}"`);
        fs_1.default.writeFileSync(buildGradlePath, content);
    }
    // 更新 strings.xml
    const stringsPath = path_1.default.join(projectPath, 'android/app/src/main/res/values/strings.xml');
    if (fs_1.default.existsSync(stringsPath)) {
        let content = fs_1.default.readFileSync(stringsPath, 'utf8');
        content = content.replace(/<string name="app_name">[^<]*<\/string>/g, `<string name="app_name">${name}</string>`);
        fs_1.default.writeFileSync(stringsPath, content);
    }
}
function updateIOSConfig(projectPath, name) {
    // 查找并更新 Info.plist
    const iosPath = path_1.default.join(projectPath, 'ios');
    if (!fs_1.default.existsSync(iosPath))
        return;
    try {
        const files = fs_1.default.readdirSync(iosPath);
        const infoPlistPath = files
            .map(file => path_1.default.join(iosPath, file, 'Info.plist'))
            .find(file => fs_1.default.existsSync(file));
        if (infoPlistPath) {
            let content = fs_1.default.readFileSync(infoPlistPath, 'utf8');
            content = content.replace(/<key>CFBundleDisplayName<\/key>\s*<string>[^<]*<\/string>/g, `<key>CFBundleDisplayName</key>\n\t<string>${name}</string>`);
            fs_1.default.writeFileSync(infoPlistPath, content);
        }
    }
    catch (error) {
        console.warn(chalk_1.default.yellow('⚠️ 无法更新 iOS 配置'));
    }
}
