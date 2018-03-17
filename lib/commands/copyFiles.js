// @flow

import loadData from './dataSources/allFiles'
import rendererFactory from './renderers/file'

import type { Dependencies, SimpleItem } from '../types'

export default (dependencies: Dependencies) => {
	const renderer = rendererFactory(dependencies)

	const { store } = dependencies

	const accept = (file: SimpleItem) => {
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
		description: 'Copy files',
		id: 'sparkling-copy-files'
	}
}
