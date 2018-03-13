// @flow

type BabelRange = {
	start: {
		line: number,
		column: number
	},
	end: {
		line: number,
		column: number
	}
}

export const parse = (text: string): Array<BabelToken> => {
	const {
		parse
	}: {
		parse: (string, { [string]: any }) => { tokens: Array<BabelToken> }
	} = require('babylon')
	let tokens: Array<BabelToken> = []

	try {
		const ast = parse(text, {
			sourceType: 'module',
			plugins: [
				'objectRestSpread',
				'asyncGenerators',
				'jsx',
				'flow',
				'classProperties',
				'exportExtensions'
			]
		})
		tokens = ast.tokens
	} catch (e) {
		tokens = sillyParse(text)
	}

	return tokens
}

type BabelToken = {
	type: { label: string },
	loc: BabelRange
}

export const sillyParse = (text: string): Array<BabelToken> => {
	const tokens = []
	let match
	const lines = text.split('\n')
	lines.forEach((line, lineNumber) => {
		const tokenRegex = /(("|'|`)([^"'`])*\2)|([^\s,\[\]\(\)\:{}=\.;]+|,|\[|\]|\(|\)|\:|{|}|=\>|=|\.|;)/g
		while ((match = tokenRegex.exec(line))) {
			if (!match) {
				break
			}
			tokens.push({
				type: {
					label: match[0]
				},
				loc: {
					start: {
						line: lineNumber + 1,
						column: match.index
					},
					end: {
						line: lineNumber + 1,
						column: match.index + match[0].length
					}
				}
			})
		}
	})

	return tokens
}

export function toAtomRange({ start, end }: BabelRange): Range {
	return [[start.line - 1, start.column], [end.line - 1, end.column]]
}
