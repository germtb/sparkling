import fs from 'fs'

import loadDataFactory from './dataSources/ls'
import renderer from './renderers/ls'

export default (React, store) => {
	const loadData = loadDataFactory(store)

	const accept = ({ absolutePath, command }) => {
		if (fs.lstatSync(absolutePath).isDirectory()) {
			command({ path: absolutePath })
		} else {
			store.dispatch({ type: 'HIDE' })
			atom.workspace.open(absolutePath)
		}
	}

	return {
		loadData,
		accept,
		renderer,
		sliceLength: 20,
		columns: 4,
		description: 'Project navigation',
		id: 'sparkling-ls'
	}
}
