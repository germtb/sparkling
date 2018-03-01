import loadData from './dataSources/gitReflog'
import commandFactory from './commandFactory'

const gitReflog = (React, store) => {
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
		description: 'git reflog - Copy git commit hash to clipboard',
		id: 'sparkling-git-reflog'
	}
}

export default commandFactory(gitReflog)
