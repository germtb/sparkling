import loadData from './dataSources/gitCommits'
import commandFactory from './commandFactory'

const gitCommitsFactory = (h, store) => {
	const accept = commit => {
		const value = commit.value.split(' ', 1)[0]
		atom.clipboard.write(value)
		store.dispatch({
			type: 'HIDE'
		})
	}

	return {
		loadData,
		accept,
		description: 'Copy git commit hash to clipboard',
		id: 'sparkling-git-log'
	}
}

export default commandFactory(gitCommitsFactory)
