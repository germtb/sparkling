// @flow

import { getSelectedValue } from '../selectors'
import { parse, toAtomRange } from '../utils'

import type { Dependencies, TokenItem } from '../types'

export default (dependencies: Dependencies) => {
	const {
		React,
		store,
		fromSelector,
		components: { withSideEffect }
	} = dependencies

	const loadData = (onData: (Array<TokenItem>) => void): (() => void) => {
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

	const onToken = (token: TokenItem) => {
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

	const accept = (token: TokenItem) => {
		store.dispatch({ type: 'HIDE' })
		onToken(token)
	}

	return {
		loadData,
		accept,
		childrenRenderer: () => <TokenSideEffect />,
		description: 'Find tokens in current buffer',
		id: 'sparkling-buffer-tokens',
		columns: 15,
		sliceLength: 60
	}
}
