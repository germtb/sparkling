// @flow

import loadData from './dataSources/allLines'

import type { Dependencies, PartialOptions, Item } from '../types'

export default ({ store }: Dependencies): PartialOptions => {
	const accept = (item: Item) => {
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
