// @flow

import loadEmojiFactory from './dataSources/emoji'
import rendererFactory from './renderers/emoji'

import type { Dependencies, EmojiItem } from '../types'

export default (dependencies: Dependencies) => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadEmojiFactory()

	const accept = (items: Array<EmojiItem>) => {
		const editor = atom.workspace.getActiveTextEditor()

		if (editor) {
			for (const item of items) {
				editor.insertText(item.emoji)
			}
		}

		store.dispatch({ type: 'HIDE' })
	}

	return {
		loadData,
		accept,
		renderer,
		sliceLength: 100,
		columns: 20,
		description: 'Insert emoji',
		id: 'sparkling-emoji',
		multiselect: true
	}
}
