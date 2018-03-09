// @flow

import { getSelectedValue } from '../selectors'
import { parse, toAtomRange } from '../utils'

import type { Dependencies, Item } from '../types'

export default (dependencies: Dependencies) => {
	const {
		React,
		store,
		fromSelector,
		components: { withSideEffect }
	} = dependencies

	const loadData = (onData: (Array<Item>) => void) => {
		const editor = atom.workspace.getActiveTextEditor()
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
	}

	const TokenSideEffect = withSideEffect(fromSelector(getSelectedValue))(
		token => {
			if (!token || !token.range) {
				return
			}

			const editor = atom.workspace.getActiveTextEditor()
			editor.setSelectedBufferRange(token.range)
		}
	)(() => null)

	const accept = () => {
		store.dispatch({ type: 'HIDE' })
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
