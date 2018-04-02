// @flow

import loadData from './dataSources/allLines'

import type { Dependencies, LineItem } from '../types'

export default ({ store }: Dependencies) => {
	const accept = (line: LineItem) => {
		store.dispatch({ type: 'HIDE' })
		atom.workspace.open(line.path, {
			initialLine: line.lineNumber - 1
		})
	}

	return {
		loadData,
		accept,
		description: 'Find lines in project',
		id: 'sparkling-project-lines'
	}
}
