// @flow

import loadData from './dataSources/allFiles'
import rendererFactory from './renderers/file'

import type { Dependencies, Options } from '../types'

export default (dependencies: Dependencies): Options => {
	const renderer = rendererFactory(dependencies)

	const { store } = dependencies

	const accept = file => {
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
