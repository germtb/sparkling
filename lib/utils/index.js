// @flow

import { spawn } from 'child_process'

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

export const fileReplace = async ({
	path,
	line,
	lineNumber,
	match,
	replace,
	column
}: {
	path: string,
	line: string,
	lineNumber: number,
	match: string,
	replace: string,
	column: number
}) => {
	const newLine =
		line.slice(0, column) +
		replace.replace('\\', '\\\\').replace('/', '\\/') +
		line.slice(column + match.length)

	// note: escape newLine
	const sedRegex = `${lineNumber},${lineNumber}s/^.*$/${newLine}/`
	const cmdProcess = spawnInProject('sed', ['-i', '', '-e', sedRegex, path])
	await new Promise(resolve => {
		cmdProcess.on('exit', () => {
			resolve()
		})
	})
}

export const escapeHTML = (str: string): string =>
	str.replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';')

export const spawnInProject = (cmd: string, args: Array<string>) => {
	const cwd = atom.project.getPaths()[0]
	return spawn(cmd, args, {
		cwd
	})
}

const endOfMultilineMatchRegex = /(\d+);(\d+) (\d+):(.*)/

const ackmateDFA = {
	initial: (line, state) =>
		line[0] === ':'
			? { type: 'inFile', state: { ...state, fileName: line.slice(1) } }
			: { type: 'error', state },
	inMultilineMatch: (line, state) => {
		const regexMatch = endOfMultilineMatchRegex.exec(line)

		if (regexMatch) {
			const startLine = state.startLine
			const endLine = parseInt(regexMatch[1])
			const endColumn = parseInt(regexMatch[2]) + 1
			const matchLength = parseInt(regexMatch[3])
			const fileLine = regexMatch[4]
			state.lines.push(fileLine)
			const joinedLines = state.lines.join('\n')
			const startColumn =
				joinedLines.length - fileLine.slice(endColumn).length - matchLength
			const match = joinedLines.slice(startColumn, startColumn + matchLength)

			state.processedData.push({
				value: joinedLines,
				match,
				path: state.fileName,
				startLine,
				startColumn,
				endLine,
				endColumn
			})

			return { type: 'inFile', state }
		}

		const [, ...splitRestDataLine] = line.split(';')

		return {
			type: 'inMultilineMatch',
			state: {
				...state,
				lines: [splitRestDataLine[0]]
			}
		}
	},
	inFile: (line, state) => {
		if (line === '\n') {
			return {
				type: 'initial',
				state
			}
		}

		const regex = /(\d+);((\d+ \d+,?)+):(.*)/

		const regexMatch = regex.exec(line)

		if (!regexMatch) {
			return {
				type: 'inMultilineMatch',
				state: {
					...state,
					lines: [
						line
							.split(';')
							.slice(1)
							.join('')
					],
					startLine: parseInt(line.split(';')[0])
				}
			}
		}

		const startLine = parseInt(regexMatch[1])
		const endLine = startLine
		const matches = regexMatch[2].split(',')
		const fileLine = regexMatch[regexMatch.length - 1]

		for (const match of matches) {
			const [startStr, lengthStr] = match.split(' ')
			const startColumn = parseInt(startStr)
			const endColumn = parseInt(lengthStr) + startColumn

			state.processedData.push({
				value: fileLine,
				match: fileLine.slice(startColumn, endColumn),
				path: state.fileName,
				startLine,
				startColumn,
				endLine,
				endColumn
			})
		}

		return { type: 'inFile', state }
	},
	error: (line, state) => ({ type: 'error', state })
}

export const ackmateParser = (lines: Array<string>) => {
	let node = {
		type: 'initial',
		state: {
			processedData: []
		}
	}

	for (const line of lines) {
		node = ackmateDFA[node.type](line, node.state)
	}

	return node.state.processedData
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
