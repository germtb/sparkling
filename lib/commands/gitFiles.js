import loadDataFactory from './dataSources/gitFiles'
import commandFactory from './commandFactory'
import renderer from './renderers/gitFile'

const gitFilesFactory = (h, store) => {
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
		description: 'Find git status files',
		id: 'sparkling-git-files'
	}
}

export default commandFactory(gitFilesFactory)
