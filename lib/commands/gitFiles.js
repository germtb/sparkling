// @flow

import loadDataFactory from './dataSources/gitStatus'
import rendererFactory from './renderers/gitFile'

import type { Dependencies, GitFileItem } from '../types'

export default (dependencies: Dependencies) => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadDataFactory({ hideDeletedFiles: true })

	const accept = (items: Array<GitFileItem>) => {
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
		columns: 3,
		sliceLength: 18,
		description: 'Find git status files',
		id: 'sparkling-git-files',
		multiselect: true
	}
}
