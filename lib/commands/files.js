import loadData from './dataSources/allFiles'
import rendererFactory from './renderers/file'

export default dependencies => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const accept = files => {
		for (const f of files) {
			atom.workspace.open(f.value)
		}

		store.dispatch({
			type: 'HIDE'
		})
	}

	return {
		loadData,
		accept,
		renderer,
		columns: 3,
		description: 'Find files in project',
		id: 'sparkling-files',
		multiselect: true
	}
}
