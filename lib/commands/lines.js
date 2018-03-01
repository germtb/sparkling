import commandFactory from './commandFactory'
import renderer from './renderers/line'

const linesFactory = (React, store) => {
	const loadData = onData => {
		const editor = atom.workspace.getActiveTextEditor()
		const buffer = editor.getBuffer()
		const lines = buffer.getLines().map((value, lineNumber) => ({
			value: `${lineNumber + 1} : ${value}`,
			lineNumber
		}))
		onData(lines)
	}

	const accept = line => {
		store.dispatch({ type: 'HIDE' })
		const editor = atom.workspace.getActiveTextEditor()
		editor.setCursorBufferPosition([line.lineNumber, 0])
		const cursor = editor.cursors[0]
		cursor.moveToFirstCharacterOfLine()
	}

	return {
		loadData,
		accept,
		description: 'Find lines in current buffer',
		id: 'sparkling-buffer-lines',
		sliceLength: 10,
		renderer
	}
}

export default commandFactory(linesFactory)
