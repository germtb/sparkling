import { ackmateParser } from './index'

describe('utils', () => {
	describe('ackmateParser', () => {
		it('parses one single line match in one file', () => {
			const result = ackmateParser([
				':package.json',
				'65;17 6:		"eslint-plugin-import": "^2.2.0",'
			])

			expect(result).toEqual([
				{
					value: '		"eslint-plugin-import": "^2.2.0",',
					match: 'import',
					path: 'package.json',
					startLine: 65,
					startColumn: 17,
					endLine: 65,
					endColumn: 23
				}
			])
		})

		it('parses multiple single line match in one file', () => {
			const result = ackmateParser([
				':package.json',
				'65;17 6:		"eslint-plugin-import": "^2.2.0",',
				'67;17 6:		"eslint-plugin-import": "^2.2.0",'
			])

			expect(result).toEqual([
				{
					value: '		"eslint-plugin-import": "^2.2.0",',
					match: 'import',
					path: 'package.json',
					startLine: 65,
					startColumn: 17,
					endLine: 65,
					endColumn: 23
				},
				{
					value: '		"eslint-plugin-import": "^2.2.0",',
					match: 'import',
					path: 'package.json',
					startLine: 67,
					startColumn: 17,
					endLine: 67,
					endColumn: 23
				}
			])
		})

		it('parses multiple single line match', () => {
			const result = ackmateParser([
				':lib/utils.test.js',
				'54;3 1,19 1:			const result = ackmateParser(['
			])

			expect(result).toEqual([
				{
					value: '			const result = ackmateParser([',
					match: 'c',
					path: 'lib/utils.test.js',
					startLine: 54,
					startColumn: 3,
					endLine: 54,
					endColumn: 4
				},
				{
					value: '			const result = ackmateParser([',
					match: 'c',
					path: 'lib/utils.test.js',
					startLine: 54,
					startColumn: 19,
					endLine: 54,
					endColumn: 20
				}
			])
		})

		it('parses matches from multiple files', () => {
			const result = ackmateParser([
				':lib/utils.test.js',
				'55;16 4:				":lib/utils.test.js",',
				'63;22 4:					path: "lib/utils.test.js",',
				'72;22 4:					path: "lib/utils.test.js",',
				'\n',
				':package.json',
				'15;3 4:		"test": "jest",'
			])

			expect(result).toEqual([
				{
					value: '			const result = ackmateParser([',
					match: 'c',
					path: 'lib/utils.test.js',
					startLine: 54,
					startColumn: 3,
					endLine: 54,
					endColumn: 4
				},
				{
					value: '			const result = ackmateParser([',
					match: 'c',
					path: 'lib/utils.test.js',
					startLine: 54,
					startColumn: 19,
					endLine: 54,
					endColumn: 20
				}
			])
		})
	})
})
