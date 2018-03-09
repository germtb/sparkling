import { spawn } from 'child_process'

export const fileReplace = async ({
	path,
	line,
	lineNumber,
	match,
	replace,
	column
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

export const escapeHTML = str =>
	str.replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';')

export const spawnInProject = (cmd, args) => {
	const cwd = atom.project.getPaths()[0]
	return spawn(cmd, args, {
		cwd
	})
}

const ackmateDFA = {
	initial: (line, state) =>
		line[0] === ':'
			? { type: 'inFile', state: { ...state, fileName: line.slice(1) } }
			: { type: 'error', state },
	inFile: (line, state) => {
		const [lineNumberStr, ...splitRestDataLine] = line.split(';')
		const restDataLine = splitRestDataLine.join(';')

		const [matches, ...splitLine] = restDataLine.split(':')
		const fileLine = splitLine.join(':')
		const startLine = parseInt(lineNumberStr)
		const endLine = startLine
		const splitMatches = matches.split(',')

		for (const match of splitMatches) {
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
	inMatch: (line, state) => ({ type: 'error', state }),
	error: (line, state) => ({ type: 'error', state })
}

export const ackmateParser = lines => {
	let node = {
		type: 'initial',
		state: {
			processedData: []
		}
	}

	for (const line of lines) {
		// console.log(JSON.stringify(node, null, 2))
		node = ackmateDFA[node.type](line, node.state)
	}

	// console.log(JSON.stringify(node, null, 2))
	return node.state.processedData
}

export const parse = text => {
	const { parse } = require('babylon')
	let tokens = []

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

export const sillyParse = text => {
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

export function toAtomRange({ start, end }): Range {
	return [[start.line - 1, start.column], [end.line - 1, end.column]]
}
