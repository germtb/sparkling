import loadData from './dataSources/gitReflog'
import commandFactory from './commandFactory'
import { spawnInProject } from '../utils'

const gitLogCheckoutFactory = (h, store) => {
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
		description: 'git reflog - Checkout git commit',
		id: 'sparkling-git-reflog'
	}
}

export default commandFactory(gitLogCheckoutFactory)
