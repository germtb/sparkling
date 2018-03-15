// @flow

import loadData from './dataSources/gitLog'
import { spawnInProject } from '../utils'

import type { Dependencies, PartialOptions, Item } from '../types'

export default ({ store }: Dependencies): PartialOptions => {
	const accept = (commit: Item) => {
		const value = commit.value.split(' ', 1)[0]

		const cmdProcess = spawnInProject('git', ['checkout', value])
		cmdProcess.on('exit', () => {
			store.dispatch({
				type: 'HIDE'
			})
		})
	}

	return {
		loadData,
		accept,
		sliceLength: 10,
		columns: 1,
		description: 'git log - Checkout git commit',
		id: 'sparkling-git-commit'
	}
}
