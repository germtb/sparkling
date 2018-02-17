import fs from 'fs'

import loadDataFactory from './dataSources/ls'
import commandFactory from './commandFactory'
import renderer from './renderers/ls'

const lsFactory = (h, store) => {
	const loadData = loadDataFactory(store)

	const accept = ({ absolutePath }) => {
		if (fs.lstatSync(absolutePath).isDirectory()) {
			ls({ path: absolutePath })
		} else {
			store.dispatch({ type: 'HIDE' })
			atom.workspace.open(absolutePath)
		}
	}

	return {
		loadData,
		accept,
		renderer,
		columns: 3,
		description: 'Project navigation',
		id: 'sparkling-ls'
	}
}

const ls = commandFactory(lsFactory)

export default ls
