import { spawnInProject } from '../../utils'

import {
	getFind,
	isSmartCase,
	getScope,
	isLiteralSearch,
	isWholeWord
} from '../../selectors'

export default store => onData => {
	const state = store.getState()
	const find = getFind(state)
	const smartCase = isSmartCase(state)
	const scope = getScope(state)
	const literalSearch = isLiteralSearch(state)
	const wholeWord = isWholeWord(state)

	const cmdProcess = spawnInProject('ag', [
		find,
		'--ackmate',
		...(scope === '' ? [] : ['-G', scope]),
		...(smartCase ? ['--smart-case'] : []),
		...(literalSearch ? ['--literal'] : []),
		...(wholeWord ? ['--word-regexp'] : [])
	])

	cmdProcess.stdout.on('data', data => {
		const dataLines = data.toString('utf-8').split('\n')
		const processedData = []

		let path = ''
		let i = 0

		while (i < dataLines.length) {
			const dataLine = dataLines[i]

			if (!dataLine || !dataLine.length) {
				i++
				continue
			} else if (dataLine[0] === ':') {
				path = dataLine.slice(1)
			} else {
				const [lineNumberStr, ...splitRestDataLine] = dataLine.split(';')
				const restDataLine = splitRestDataLine.join(';')
				const [matches, ...splitLine] = restDataLine.split(':')
				const line = splitLine.join(':')
				const lineNumber = parseInt(lineNumberStr)
				const splitMatches = matches.split(',')
				const preValue = [path, lineNumber].join(':')

				for (const match of splitMatches) {
					const [startStr, lengthStr] = match.split(' ')
					const start = preValue.length + 3 + parseInt(startStr)
					const end = parseInt(lengthStr) + start - 1

					processedData.push({
						value: `${preValue} : ${line}`,
						match: line.slice(start, end),
						path,
						lineNumber,
						column: parseInt(startStr),
						start,
						end
					})
				}
			}

			i++
		}

		onData(processedData)
	})

	return () => {
		cmdProcess.stdin.pause()
		cmdProcess.kill()
	}
}
