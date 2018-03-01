import loadDataFactory from './dataSources/gitFiles'
import commandFactory from './commandFactory'
import renderer from './renderers/gitFile'

const gitFilesFactory = (React, store) => {
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

export default commandFactory(gitFilesFactory)
