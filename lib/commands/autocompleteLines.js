import loadData from './dataSources/allLines'
import commandFactory from './commandFactory'

export const autocompleteLinesFactory = (React, store) => {
	const accept = item => {
		store.dispatch({ type: 'HIDE' })
		const editor = atom.workspace.getActiveTextEditor()
		editor.insertText(item.line)
	}

	return {
		loadData,
		accept,
		description: 'Autocomplete lines from project',
		id: 'sparkling-autocomplete-lines'
	}
}

export default commandFactory(autocompleteLinesFactory)
