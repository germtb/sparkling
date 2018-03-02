import loadData from './dataSources/allFiles'
import renderer from './renderers/file'

export default (React, store) => {
	const accept = file => {
		atom.workspace.open(file.value)
		store.dispatch({
			type: 'HIDE'
		})
	}

	return {
		loadData,
		accept,
		renderer,
		sliceLength: 20,
		columns: 4,
		description: 'Find files in project',
		id: 'sparkling-files'
	}
}
