import commandFactory from './commandFactory'

const linesFactory = (h, store) => {
	const loadData = onData => {
		const editor = atom.workspace.getActiveTextEditor()
		const buffer = editor.getBuffer()
		const lines = buffer
			.getLines()
			.map((value, lineNumber) => ({
				value,
				lineNumber
			}))
			.filter(({ value }) => value.trim().length > 1)
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
		id: 'sparkling-buffer-lines'
	}
}

export default commandFactory(linesFactory)
