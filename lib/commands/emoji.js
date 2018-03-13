// @flow

import loadEmojiFactory from './dataSources/emoji'
import rendererFactory from './renderers/emoji'

import type { Dependencies, Options } from '../types'

export default (dependencies: Dependencies): Options => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadEmojiFactory()

	const accept = ({ emoji }) => {
		const editor = atom.workspace.getActiveTextEditor()
		if (editor) {
			editor.insertText(emoji)
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
		id: 'sparkling-emoji'
	}
}
