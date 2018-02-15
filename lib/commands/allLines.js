import loadData from './dataSources/allLines'
import renderer from './renderers/line'

export const allLinesFactory = (h, store) => {
	const accept = line => {
		store.dispatch({ type: 'HIDE' })
		atom.workspace.open(line.path, {
			initialLine: line.lineNumber - 1
		})
	}

	return { loadData, accept }
}

export const autocompleteLinesFactory = (h, store) => {
	const accept = line => {
		store.dispatch({ type: 'HIDE' })
		const editor = atom.workspace.getActiveTextEditor()
		editor.insertText(line.line)
	}

	return { loadData, accept, renderer }
}
