// @flow

import { spawnInProject, ackmateParser } from '../../utils'

import {
	getFind,
	isSmartCase,
	getScope,
	isLiteralSearch,
	isWholeWord
} from '../../selectors'

import type { Item, Store } from '../../types'

export default (store: Store) => (
	onData: (Array<Item>) => void
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
		...(scope === '' ? [] : ['-G', scope]),
		...(smartCase ? ['--smart-case'] : []),
		...(literalSearch ? ['--literal'] : []),
		...(wholeWord ? ['--word-regexp'] : [])
	])

	cmdProcess.stdout.on('data', data => {
		const lines = data.toString('utf-8').split('\n')
		onData(ackmateParser(lines))
	})

	return () => {
		// cmdProcess.stdin.pause()
		cmdProcess.kill()
	}
}
