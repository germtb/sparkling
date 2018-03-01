import loadData from './dataSources/allFiles'
import renderer from './renderers/file'
import commandFactory from './commandFactory'

import { spawnInProject } from '../utils'

const removeFiles = (React, store) => {
	const accept = file => {
		spawnInProject('rm', [file.value])

		store.dispatch({
			type: 'REMOVE_ITEM',
			payload: file
		})
	}

	return {
		loadData,
		accept,
		renderer,
		sliceLength: 20,
		columns: 4,
		description: 'Remove files in project',
		id: 'sparkling-files'
	}
}

export default commandFactory(removeFiles)
