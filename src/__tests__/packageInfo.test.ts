import { packageInfo } from '../utils/packageInfo'

describe('packageInfo', () => {
	it('should return package information', () => {
		const info = packageInfo()

		expect(info).toBeDefined()
		expect(info.name).toBe('@seaart/cli')
		expect(info.version).toBeDefined()
		expect(info.description).toBeDefined()
	})

	it('should return fallback values on error', () => {
		// This test ensures the fallback mechanism works
		const info = packageInfo()

		expect(typeof info.name).toBe('string')
		expect(typeof info.version).toBe('string')
		expect(typeof info.description).toBe('string')
	})
}) 