// @flow

import loadData from './dataSources/gitBranches'
import { spawnInProject } from '../utils'

import type { Dependencies, Options } from '../types'

export default ({ store }: Dependencies): Options => {
	const accept = branch => {
		const value = branch.value.trim()

		if (/^\*/.test(value)) {
			return
		}

		const cmdProcess = spawnInProject('git', ['checkout', value])
		cmdProcess.stdout.on('data', () => {
			store.dispatch({
				type: 'HIDE'
			})
		})
	}

	return {
		loadData,
		accept,
		columns: 3,
		sliceLength: 9,
		description: 'Checkout git branches',
		id: 'sparkling-git-branches'
	}
}
