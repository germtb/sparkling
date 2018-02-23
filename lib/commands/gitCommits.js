import loadData from './dataSources/gitCommits'
import commandFactory from './commandFactory'
import { spawnInProject } from '../utils'

const gitCommitsFactory = (h, store) => {
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
		description: 'Checkout git commit',
		id: 'sparkling-git-commit'
	}
}

export default commandFactory(gitCommitsFactory)
