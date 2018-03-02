import loadData from './dataSources/allFiles'
import renderer from './renderers/file'

export default (React, store) => {
	const accept = file => {
		store.dispatch({
			type: 'SHOW_INPUT',
			payload: {
				id: 'sparkling-move-file-confirm',
				originPath: file.value,
				value: file.value
			}
		})
	}

	return {
		loadData,
		accept,
		renderer,
		sliceLength: 20,
		columns: 4,
		description: 'Move files in project',
		id: 'sparkling-move-files'
	}
}
