import loadData from './dataSources/allFiles'
import renderer from './renderers/file'
import commandFactory from './commandFactory'

const copyFiles = (React, store) => {
	const accept = file => {
		store.dispatch({
			type: 'SHOW_EXTRA_INPUT',
			payload: {
				id: 'sparkling-copy-file-confirm',
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
		description: 'Copy files in project',
		id: 'sparkling-copy-files'
	}
}

export default commandFactory(copyFiles)
