// @flow

import loadData from './dataSources/allFiles'
import rendererFactory from './renderers/file'

import type { Dependencies, PartialOptions } from '../types'

export default (dependencies: Dependencies): PartialOptions => {
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
		sliceLength: 20,
		columns: 4,
		description: 'Find files in project',
		id: 'sparkling-files',
		multiselect: true
	}
}
