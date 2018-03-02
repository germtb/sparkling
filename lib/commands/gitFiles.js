import loadDataFactory from './dataSources/gitFiles'
import renderer from './renderers/gitFile'

export default (React, store) => {
	const loadData = loadDataFactory({ hideDeletedFiles: true })

	const accept = ({ path }) => {
		atom.workspace.open(path)
		store.dispatch({
			type: 'HIDE'
		})
	}

	return {
		loadData,
		accept,
		renderer,
		columns: 3,
		description: 'Find git status files',
		id: 'sparkling-git-files'
	}
}
