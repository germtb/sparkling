// @flow

import loadData from './dataSources/allLines'

import type { Dependencies, Options } from '../types'

export default ({ store }: Dependencies): Options => {
	const accept = line => {
		store.dispatch({ type: 'HIDE' })
		atom.workspace.open(line.path, {
			initialLine: line.lineNumber - 1
		})
	}

	return {
		loadData,
		accept,
		columns: 1,
		sliceLength: 10,
		description: 'Find lines in project',
		id: 'sparkling-project-lines'
	}
}
