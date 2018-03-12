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
	endColumn,
	endLine,
	startColumn,
	startLine,
	replace
}: {
	path: string,
	endColumn: number,
	endLine: number,
	startColumn: number,
	startLine: number,
	replace: string
}) => {
	const nodePath = require('path')
	const fs = require('fs')
	const { Transform } = require('stream')

	const cwd = atom.project.getPaths()[0]
	const absolutePath = nodePath.resolve(cwd, `./${path}`)

	let linesLength = 1

	const replaceStream = new Transform({
		transform(chunk, encoding, callback) {
			const splitChunk = chunk.toString('utf-8').split('\n')

			const lines = splitChunk.reduce((lines, line, index) => {
				const lineIndex = index + linesLength

				if (lineIndex === startLine && lineIndex === endLine) {
					lines.push([
						line.slice(0, startColumn) + replace + line.slice(endColumn)
					])
				} else if (lineIndex === startLine) {
					lines.push([line.slice(0, startColumn)])
				} else if (lineIndex > startLine && lineIndex < endLine) {
					// Ignore
				} else if (lineIndex === endLine) {
					lines.push(replace + line.slice(endColumn))
				} else {
					lines.push(line)
				}

				return lines
			}, [])

			linesLength += lines.length

			callback(null, lines.join('\n'))
		}
	})

	const readStream = fs.createReadStream(absolutePath)
	const writeStream = fs.createWriteStream(
		absolutePath + '.tempWithAReallyLongHash'
	)

	readStream
		.pipe(replaceStream)
		.pipe(writeStream)
		.on('finish', () => {
			spawnInProject('rm', [absolutePath])
			spawnInProject('mv', [
				absolutePath + '.tempWithAReallyLongHash',
				absolutePath
			])
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

		const { startLine, fileName, lines } = state

		if (!lines || startLine === undefined || startLine === null || !fileName) {
			throw new Error('Error during parsing of ackmate format')
		}

		if (regexMatch) {
			const endLine = parseInt(regexMatch[1])
			const startColumn = parseInt(regexMatch[2])
			const matchLength = parseInt(regexMatch[3])
			const fileLine = regexMatch[4]
			const endColumn = matchLength + startColumn - lines.join('\n').length - 1
			const joinedLines = [...lines, fileLine].join('\n')
			const match = joinedLines.slice(startColumn, startColumn + matchLength)

			state.processedData.push({
				value: joinedLines,
				match,
				path: fileName,
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
				lines: [...(state.lines || []), splitRestDataLine.join(';')]
			}
		}
	},
	inFile: (line, state) => {
		if (line === '') {
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
			const fileName = state.fileName

			if (fileName) {
				state.processedData.push({
					value: fileLine,
					match: fileLine.slice(startColumn, endColumn),
					path: fileName,
					startLine,
					startColumn,
					endLine,
					endColumn
				})
			} else {
				throw new Error('Error during parsing of ackmate format')
			}
		}

		return { type: 'inFile', state }
	},
	error: (line, state) => ({ type: 'error', state })
}

type AckmateMatch = {
	+value: string,
	match: string,
	path: string,
	startLine: number,
	startColumn: number,
	endLine: number,
	endColumn: number
}

type AckmateDFAStates = 'initial' | 'inMultilineMatch' | 'inFile' | 'error'
type AckmateDFAState = {
	processedData: Array<AckmateMatch>,
	lines?: Array<string>,
	fileName?: string,
	startLine?: number
}

export const ackmateParser = (lines: Array<string>) => {
	let node: {
		type: AckmateDFAStates,
		state: AckmateDFAState
	} = {
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
