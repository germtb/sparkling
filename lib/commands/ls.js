import fs from 'fs'

import loadDataFactory from './dataSources/ls'
import renderer from './renderers/ls'
import { getOptions } from '../selectors'

export default (React, store) => {
	const loadData = loadDataFactory(store)

	const accept = ({ absolutePath }) => {
		const { lsCommand } = getOptions(store.getState())
		if (fs.lstatSync(absolutePath).isDirectory()) {
			lsCommand({ path: absolutePath, description: absolutePath, lsCommand })
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
