// @flow

import loadDataFactory from './dataSources/gitFiles'
import rendererFactory from './renderers/gitFile'

import type { Dependencies, Options } from '../types'

export default (dependencies: Dependencies): Options => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadDataFactory({ hideDeletedFiles: true })

	const accept = ({ path }) => {
		atom.workspace.open(path)
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
		id: 'sparkling-git-files'
	}
}
