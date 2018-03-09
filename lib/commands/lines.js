import { getSelectedValue } from '../selectors'

export default dependencies => {
	const {
		store,
		React,
		fromSelector,
		components: { withSideEffect }
	} = dependencies

	const loadData = onData => {
		const editor = atom.workspace.getActiveTextEditor()
		const buffer = editor.getBuffer()
		const lines = buffer.getLines().map((value, lineNumber) => ({
			value: `${lineNumber + 1} : ${value}`,
			lineNumber
		}))
		onData(lines)
	}

	const accept = () => {
		store.dispatch({ type: 'HIDE' })
	}

	const LineSideEffect = withSideEffect(fromSelector(getSelectedValue))(
		line => {
			if (!line) {
				return
			}

			const editor = atom.workspace.getActiveTextEditor()
			editor.setCursorBufferPosition([line.lineNumber, 0])
			editor.moveToFirstCharacterOfLine()
			editor.selectToEndOfLine()
		}
	)(() => null)

	return {
		loadData,
		accept,
		childrenRenderer: () => <LineSideEffect />,
		description: 'Find lines in current buffer',
		id: 'sparkling-buffer-lines',
		sliceLength: 10
	}
}
