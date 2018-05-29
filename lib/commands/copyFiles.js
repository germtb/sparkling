

import loadData from './dataSources/allFiles'
import rendererFactory from './renderers/file'

                                                        

export default (dependencies              ) => {
	const renderer = rendererFactory(dependencies)

	const { store } = dependencies

	const accept = (file            ) => {
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
		columns: 3,
		description: 'Copy files',
		id: 'sparkling-copy-files'
	}
}
