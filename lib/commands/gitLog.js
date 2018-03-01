import loadData from './dataSources/gitLog'
import commandFactory from './commandFactory'

const gitLogCheckoutFactory = (React, store) => {
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
		description: 'git log - Copy git commit hash to clipboard',
		id: 'sparkling-git-log'
	}
}

export default commandFactory(gitLogCheckoutFactory)
