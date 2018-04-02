// @flow

import loadDataFactory from './dataSources/gitFiles'
import rendererFactory from './renderers/gitFile'

import type { Dependencies, GitFileItem } from '../types'

export default (dependencies: Dependencies) => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadDataFactory({ hideDeletedFiles: false })

	const accept = (files: Array<GitFileItem>) => {
		for (const file of files) {
			const { value, status } = file

			const deletedStatuses = [' D', 'AD', 'DD']

			if (!deletedStatuses.includes(status)) {
				atom.workspace.open(value)
			}
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
