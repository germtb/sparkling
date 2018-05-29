

import { getSelectedValue } from '../selectors'

                                                            

export default (dependencies              ) => {
	const {
		store,
		React,
		fromSelector,
		components: { withSideEffect }
	} = dependencies

	const loadData = (onData                                 )               => {
		const editor = atom.workspace.getActiveTextEditor()
		if (!editor) {
			onData([])
			return () => {}
		}

		const buffer = editor.getBuffer()
		const lines = buffer.getLines().map((value, lineNumber) => ({
			value: `${lineNumber + 1} : ${value}`,
			lineNumber
		}))

		onData(lines)

		return () => {}
	}

	const onLine = (line                ) => {
		if (!line) {
			return
		}

		const editor = atom.workspace.getActiveTextEditor()
		if (!editor) {
			return
		}

		editor.setCursorBufferPosition([line.lineNumber, 0])
		editor.moveToFirstCharacterOfLine()
		editor.selectToEndOfLine()
	}

	const accept = (line                ) => {
		onLine(line)
		store.dispatch({ type: 'HIDE' })
	}

	const LineSideEffect = withSideEffect(fromSelector(getSelectedValue))(onLine)(
		() => null
	)

	return {
		loadData,
		accept,
		childrenRenderer: () => <LineSideEffect />,
		description: 'Find lines in current buffer',
		id: 'sparkling-buffer-lines'
	}
}
