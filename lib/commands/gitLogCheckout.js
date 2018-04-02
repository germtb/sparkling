// @flow

import loadData from './dataSources/gitLog'
import { spawnInProject } from '../utils'

import type { Dependencies, SimpleItem } from '../types'

export default ({ store }: Dependencies) => {
	const accept = (commit: SimpleItem) => {
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
		description: 'git log - Checkout git commit',
		id: 'sparkling-git-commit'
	}
}
