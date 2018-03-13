import { ackmateParserFactory } from './ackmateParser'

describe('ackmateParser', () => {
	let ackmateParser

	beforeEach(() => {
		ackmateParser = new ackmateParserFactory()
	})

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
				startLine: 64,
				startColumn: 17,
				endLine: 64,
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
				startLine: 64,
				startColumn: 17,
				endLine: 64,
				endColumn: 23
			},
			{
				value: '		"eslint-plugin-import": "^2.2.0",',
				match: 'import',
				path: 'package.json',
				startLine: 66,
				startColumn: 17,
				endLine: 66,
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
				startLine: 53,
				startColumn: 3,
				endLine: 53,
				endColumn: 4
			},
			{
				value: '			const result = ackmateParser([',
				match: 'c',
				path: 'lib/utils.test.js',
				startLine: 53,
				startColumn: 19,
				endLine: 53,
				endColumn: 20
			}
		])
	})

	it('parses matches from multiple files', () => {
		const result = ackmateParser([
			':lib/utils.test.js',
			'72;22 4:					path: "lib/utils.test.js",',
			'',
			':package.json',
			'15;3 4:		"test": "jest",'
		])

		expect(result).toEqual([
			{
				value: '					path: "lib/utils.test.js",',
				match: 'test',
				path: 'lib/utils.test.js',
				startLine: 71,
				startColumn: 22,
				endLine: 71,
				endColumn: 26
			},
			{
				value: '		"test": "jest",',
				match: 'test',
				path: 'package.json',
				startLine: 14,
				startColumn: 3,
				endLine: 14,
				endColumn: 7
			}
		])
	})

	it('parses multiline matches #1', () => {
		const result = ackmateParser([
			':package.json',
			'30;		"test": "jest",',
			'31;3 19:		"build": "rollup -c"'
		])

		expect(result).toEqual([
			{
				value: '		"test": "jest",\n		"build": "rollup -c"',
				match: 'test": "jest",\n		"b',
				path: 'package.json',
				startLine: 29,
				startColumn: 3,
				endLine: 30,
				endColumn: 4
			}
		])
	})

	it('parses multiline matchs #2', () => {
		const result = ackmateParser([
			':lib/commands/renderers/find.js',
			'24;	debugger',
			'25;1 13:	debugger'
		])

		expect(result).toEqual([
			{
				value: '	debugger\n	debugger',
				match: 'debugger\n	deb',
				path: 'lib/commands/renderers/find.js',
				startLine: 23,
				startColumn: 1,
				endLine: 24,
				endColumn: 4
			}
		])
	})

	it('parses multiline matches with more than 2 lines', () => {
		const result = ackmateParser([
			':README.md',
			'19;* Common file operations: copy, move, delete',
			'20;* Common git operations: checkout branch, checked -- file, stage file, checkout commit, copy commit hash...',
			'21;38 127:* Folder navigation via ls'
		])

		expect(result).toEqual([
			{
				value: [
					'* Common file operations: copy, move, delete',
					'* Common git operations: checkout branch, checked -- file, stage file, checkout commit, copy commit hash...',
					'* Folder navigation via ls'
				].join('\n'),
				match: [
					'delete',
					'* Common git operations: checkout branch, checked -- file, stage file, checkout commit, copy commit hash...',
					'* Folder nav'
				].join('\n'),
				path: 'README.md',
				startLine: 18,
				startColumn: 38,
				endLine: 20,
				endColumn: 12
			}
		])
	})
})
