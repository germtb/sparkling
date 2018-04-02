// @flow

import fs from 'fs'

import loadDataFactory from './dataSources/ls'
import rendererFactory from './renderers/ls'
import { getOptions } from '../selectors'

import type { Dependencies, LsItem, LsOptions } from '../types'

export default (dependencies: Dependencies) => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadDataFactory(store)

	const accept = ({ absolutePath }: LsItem) => {
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
		columns: 3,
		description: 'Project navigation',
		id: 'sparkling-ls'
	}
}
