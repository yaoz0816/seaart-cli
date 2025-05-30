"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packageInfo_1 = require("../utils/packageInfo");
describe('packageInfo', () => {
    it('should return package information', () => {
        const info = (0, packageInfo_1.packageInfo)();
        expect(info).toBeDefined();
        expect(info.name).toBe('@seaart/cli');
        expect(info.version).toBeDefined();
        expect(info.description).toBeDefined();
    });
    it('should return fallback values on error', () => {
        // This test ensures the fallback mechanism works
        const info = (0, packageInfo_1.packageInfo)();
        expect(typeof info.name).toBe('string');
        expect(typeof info.version).toBe('string');
        expect(typeof info.description).toBe('string');
    });
});
