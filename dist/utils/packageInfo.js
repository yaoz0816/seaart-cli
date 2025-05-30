"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageInfo = packageInfo;
exports.getProjectPackageInfo = getProjectPackageInfo;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function packageInfo() {
    try {
        const packageJsonPath = path_1.default.join(__dirname, '../../package.json');
        const packageJson = fs_extra_1.default.readJsonSync(packageJsonPath);
        return {
            name: packageJson.name,
            version: packageJson.version,
            description: packageJson.description
        };
    }
    catch (error) {
        return {
            name: '@seaart/cli',
            version: '1.0.0',
            description: 'SeaArt React Native 项目脚手架工具'
        };
    }
}
function getProjectPackageInfo(projectPath = process.cwd()) {
    try {
        const packageJsonPath = path_1.default.join(projectPath, 'package.json');
        const packageJson = fs_extra_1.default.readJsonSync(packageJsonPath);
        return {
            name: packageJson.name,
            version: packageJson.version,
            description: packageJson.description
        };
    }
    catch (error) {
        return null;
    }
}
