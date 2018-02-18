import loadData from './dataSources/allFiles'
import renderer from './renderers/file'
import commandFactory from './commandFactory'

const renameFiles = (h, store) => {
	const accept = file => {
		store.dispatch({
			type: 'SHOW_EXTRA_INPUT',
			payload: {
				id: 'sparking-rename-file-confirm',
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
		description: 'Rename files in project',
		id: 'sparkling-rename-files'
	}
}

export default commandFactory(renameFiles)
