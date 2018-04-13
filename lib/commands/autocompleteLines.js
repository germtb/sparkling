

import loadData from './dataSources/allLines'

                                                      

export default ({ store }              ) => {
	const accept = (item          ) => {
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
