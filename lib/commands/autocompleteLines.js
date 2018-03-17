// @flow

import loadData from './dataSources/allLines'

import type { Dependencies, LineItem } from '../types'

export default ({ store }: Dependencies) => {
	const accept = (item: LineItem) => {
		store.dispatch({ type: 'HIDE' })
		const editor = atom.workspace.getActiveTextEditor()
		if (editor) {
			editor.insertText(item.line)
		}
	}

	return {
		loadData,
		accept,
		columns: 1,
		sliceLength: 10,
		description: 'Autocomplete lines from project',
		id: 'sparkling-autocomplete-lines'
	}
}
