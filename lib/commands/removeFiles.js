import loadData from './dataSources/allFiles'
import rendererFactory from './renderers/file'

import { spawnInProject } from '../utils'

export default dependencies => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

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
