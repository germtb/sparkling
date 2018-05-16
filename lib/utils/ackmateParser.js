const endOfMultilineMatchRegex = /(\d+);(\d+) (\d+):(.*)/

const ackmateDFA = {
	initial: (line, state) => {
		return line[0] === ':'
			? { type: 'inFile', state: { ...state, fileName: line.slice(1) } }
			: { type: 'initial', state }
	},
	inMultilineMatch: (line, state) => {
		const regexMatch = endOfMultilineMatchRegex.exec(line)

		const { startLine, fileName, lines } = state

		if (!lines || startLine === undefined || startLine === null || !fileName) {
			throw new Error('Error during parsing of ackmate format')
		}

		if (regexMatch) {
			const endLine = parseInt(regexMatch[1]) - 1
			const startColumn = parseInt(regexMatch[2])
			const matchLength = parseInt(regexMatch[3])
			const fileLine = regexMatch[4]
			const endColumn = matchLength + startColumn - lines.join('\n').length - 1
			const joinedLines = [...lines, fileLine].join('\n')
			const match = joinedLines.slice(startColumn, startColumn + matchLength)

			state.processedData.push({
				value: `${fileName}\n${joinedLines}`,
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
					startLine: parseInt(line.split(';')[0]) - 1
				}
			}
		}

		const startLine = parseInt(regexMatch[1]) - 1
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
					value: `${fileName}\n${fileLine}`,
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

export const ackmateParserFactory = () => {
	let node = {
		type: 'initial',
		state: {
			processedData: []
		}
	}

	return lines => {
		for (const line of lines) {
			node = ackmateDFA[node.type](line, node.state)
		}

		const result = node.state.processedData
		node.state.processedData = []
		return result
	}
}
