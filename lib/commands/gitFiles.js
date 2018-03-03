import loadDataFactory from './dataSources/gitFiles'
import rendererFactory from './renderers/gitFile'

export default dependencies => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

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
