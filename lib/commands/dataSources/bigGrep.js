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

	const cmdProcess = spawnInProject('tbgs', [find])

	cmdProcess.stdout.on('data', chunk => {
		console.log('chunk: ', chunk.toString('utf-8').split('\n'))
		const lines = chunk.toString('utf-8').split('\n')
		onData(
			lines
				.filter(lineStr => lineStr.length > 0 && lineStr.length < 500)
				.map(lineStr => {
					const [
						path,
						startLineStr,
						startColumnStr,
						...lineRest
					] = lineStr.split(':')
					const startLine = parseInt(startLineStr)
					const startColumn = parseInt(startColumnStr) - 1
					const line = lineRest.join(':')
					return {
						value: `${path}\n${line}`,
						match: find,
						path,
						startLine,
						endLine: startLine,
						startColumn,
						endColumn: startColumn + find.length
					}
				})
		)
	})

	cmdProcess.on('close', chunk => {
		try {
			console.log('Closde chunk: ', chunk.toString('utf-8'))
		} catch(e) {
			console.log('Closde chunk with error: ', e)
		}
	})

	return () => {
		cmdProcess.kill()
	}
}
