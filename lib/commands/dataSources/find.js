// @flow

import { spawnInProject, ackmateParserFactory } from '../../utils'

import {
	getFind,
	isSmartCase,
	getScope,
	isLiteralSearch,
	isWholeWord
} from '../../selectors'

import type { AckmateItem, Store } from '../../types'

export default (store: Store) => (
	onData: (Array<AckmateItem>) => void
): (() => void) => {
	const state = store.getState()
	const find = getFind(state)
	const smartCase = isSmartCase(state)
	const scope = getScope(state)
	const literalSearch = isLiteralSearch(state)
	const wholeWord = isWholeWord(state)

	const cmdProcess = spawnInProject('ag', [
		find,
		'--ackmate',
		'--width',
		'500',
		...(scope === '' ? [] : ['-G', scope]),
		...(smartCase ? ['--smart-case'] : []),
		...(literalSearch ? ['--literal'] : []),
		...(wholeWord ? ['--word-regexp'] : [])
	])

	const ackmateParser = ackmateParserFactory()

	let acc = ''

	cmdProcess.stdout.on('data', chunk => {
		const lines = chunk.toString('utf-8').split('\n')
		lines[0] = acc + lines[0]
		acc = lines[lines.length - 1]
		onData(
			ackmateParser(lines.slice(0, -1)).filter(item => item.value.length < 500)
		)
	})

	cmdProcess.on('close', () => {
		onData(ackmateParser([acc]))
	})

	return () => {
		cmdProcess.kill()
	}
}
