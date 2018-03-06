// @flow

import loadData from './dataSources/gitLog'
import { spawnInProject } from '../utils'

import type { Dependencies, Options } from '../types'

export default ({ store }: Dependencies): Options => {
	const accept = commit => {
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
