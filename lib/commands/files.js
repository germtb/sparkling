// @flow

import loadData from './dataSources/allFiles'
import rendererFactory from './renderers/file'

import type { Dependencies, Options } from '../types'

export default (dependencies: Dependencies): Options => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

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
