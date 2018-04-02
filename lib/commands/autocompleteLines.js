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
		description: 'Autocomplete lines from project',
		id: 'sparkling-autocomplete-lines'
	}
}
