// @flow

import loadData from './dataSources/allFiles'
import rendererFactory from './renderers/file'

import type { Dependencies, PartialOptions, Item } from '../types'

export default (dependencies: Dependencies): PartialOptions => {
	const renderer = rendererFactory(dependencies)

	const { store } = dependencies

	const accept = (file: Item) => {
		if (!file) {
			store.dispatch({ type: 'HIDE' })
			return
		}

		store.dispatch({
			type: 'SHOW_EXTRA_INPUT',
			payload: {
				id: 'sparkling-copy-file-confirm',
				value: file.value,
				originPath: file.value
			}
		})
	}

	return {
		loadData,
		accept,
		renderer,
		sliceLength: 20,
		columns: 4,
		description: 'Copy files in project',
		id: 'sparkling-copy-files'
	}
}
