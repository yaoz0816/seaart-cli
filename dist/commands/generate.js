"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCode = generateCode;
const chalk_1 = __importDefault(require("chalk"));
async function generateCode(generator, options = {}) {
    console.log(chalk_1.default.blue(`\n🔧 代码生成: ${generator}\n`));
    console.log(chalk_1.default.yellow('🚧 此功能正在开发中...'));
    console.log(chalk_1.default.gray('生成器:', generator));
    console.log(chalk_1.default.gray('选项:', options));
}
