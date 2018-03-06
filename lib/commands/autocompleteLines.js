// @flow

import loadData from './dataSources/allLines'

import type { Dependencies, Options } from '../types'

export default ({ store }: Dependencies): Options => {
	const accept = item => {
		store.dispatch({ type: 'HIDE' })
		const editor = atom.workspace.getActiveTextEditor()
		editor.insertText(item.line)
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
