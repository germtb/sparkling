// @flow

import loadDataFactory from './dataSources/gitFiles'
import rendererFactory from './renderers/gitFile'

import type { Dependencies, PartialOptions } from '../types'

export default (dependencies: Dependencies): PartialOptions => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadDataFactory({ hideDeletedFiles: true })

	const accept = items => {
		for (const item of items) {
			atom.workspace.open(item.path)
		}

		store.dispatch({
			type: 'HIDE'
		})
	}

	return {
		loadData,
		accept,
		renderer,
		columns: 4,
		sliceLength: 20,
		description: 'Find git status files',
		id: 'sparkling-git-files',
		multiselect: true
	}
}
