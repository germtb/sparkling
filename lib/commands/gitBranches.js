import loadData from './dataSources/gitBranches'
import commandFactory from './commandFactory'
import { spawnInProject } from '../utils'

const gitBranchesFactory = (h, store) => {
	const accept = branch => {
		const value = branch.value.trim(0)

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
		description: 'Checkout git branches',
		id: 'sparkling-git-branches'
	}
}

export default commandFactory(gitBranchesFactory)
