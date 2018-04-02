// @flow

import loadDataFactory from './dataSources/gitStatus'
import rendererFactory from './renderers/gitFile'

import type { Dependencies, GitFileItem } from '../types'

export default (dependencies: Dependencies) => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadDataFactory({ dependencies, hideDeletedFiles: true })

	const accept = (files: Array<GitFileItem>) => {
		for (const file of files) {
			atom.workspace.open(file.path)
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
		description: 'Open git status files',
		id: 'sparkling-git-stage',
		multiselect: true
	}
}
