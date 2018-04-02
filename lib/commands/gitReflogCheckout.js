// @flow

import loadData from './dataSources/gitReflog'
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
		description: 'git reflog - Checkout git commit',
		id: 'sparkling-git-reflog'
	}
}
