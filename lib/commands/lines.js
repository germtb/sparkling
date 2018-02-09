const linesFactory = (React, store) => {
	const loadData = onData => {
		const editor = atom.workspace.getActiveTextEditor()
		const buffer = editor.getBuffer()
		const lines = buffer.getLines()
		onData(lines)
	}

	const accept = line => {
		console.log('line: ', line)
	}

	return { loadData, accept }
}

module.exports = linesFactory
