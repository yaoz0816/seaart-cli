"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorCheck = doctorCheck;
const chalk_1 = __importDefault(require("chalk"));
async function doctorCheck(options = {}) {
    console.log(chalk_1.default.blue('\n🩺 环境检查\n'));
    console.log(chalk_1.default.yellow('🚧 此功能正在开发中...'));
    console.log(chalk_1.default.gray('选项:', options));
}
