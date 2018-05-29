

import loadData from './dataSources/gitBranches'
import { spawnInProject } from '../utils'

                                                        

export default ({ store }              ) => {
	const accept = (branch            ) => {
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
		description: 'git checkout',
		id: 'sparkling-git-branches'
	}
}
