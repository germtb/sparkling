// @flow

import loadData from './dataSources/allFiles'
import rendererFactory from './renderers/file'

import type { Dependencies, SimpleItem } from '../types'

export default (dependencies: Dependencies) => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const accept = (files: Array<SimpleItem>) => {
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
		sliceLength: 18,
		columns: 3,
		description: 'Find files in project',
		id: 'sparkling-files',
		multiselect: true
	}
}
