// @flow

import loadEmojiFactory from './dataSources/emoji'
import rendererFactory from './renderers/emoji'

import type { Dependencies, PartialOptions } from '../types'

export default (dependencies: Dependencies): PartialOptions => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadEmojiFactory()

	const accept = items => {
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
		description: 'Emoji insertion',
		id: 'sparkling-emoji',
		multiselect: true
	}
}
