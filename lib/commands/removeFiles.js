import loadData from './dataSources/allFiles'
import rendererFactory from './renderers/file'

import { spawnInProject } from '../utils'

export default dependencies => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const accept = item => {
		spawnInProject('rm', [item.value])

		store.dispatch({
			type: 'REMOVE_ITEM',
			payload: { item }
		})
	}

	return {
		loadData,
		accept,
		renderer,
		sliceLength: 20,
		columns: 4,
		description: 'rm',
		id: 'sparkling-files'
	}
}
