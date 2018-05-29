import { getSelectedValue } from '../selectors'
import { parse, toAtomRange } from '../utils'

export default dependencies => {
	const {
		React,
		store,
		fromSelector,
		components: { withSideEffect }
	} = dependencies

	const loadData = onData => {
		const editor = atom.workspace.getActiveTextEditor()

		if (!editor) {
			onData([])
			return () => {}
		}

		const text = editor.getText()
		const tokens = parse(text)

		onData(
			tokens
				.map(token => {
					const range = toAtomRange(token.loc)
					return {
						value: editor.getTextInBufferRange(range),
						range
					}
				})
				.filter(token => token.value && token.value.length > 3)
		)

		return () => {}
	}

	const onToken = token => {
		if (!token || !token.range) {
			return
		}

		const editor = atom.workspace.getActiveTextEditor()
		if (editor) {
			editor.setSelectedBufferRange(token.range)
		}
	}

	const TokenSideEffect = withSideEffect(fromSelector(getSelectedValue))(
		onToken
	)(() => null)

	const accept = token => {
		store.dispatch({ type: 'HIDE' })
		onToken(token)
	}

	return {
		loadData,
		accept,
		childrenRenderer: () => <TokenSideEffect />,
		description: 'Find tokens in current buffer',
		id: 'sparkling-buffer-tokens',
		columns: 15
	}
}
