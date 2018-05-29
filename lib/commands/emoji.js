

import loadEmojiFactory from './dataSources/emoji'
import rendererFactory from './renderers/emoji'



export default (dependencies              ) => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadEmojiFactory()

	const accept = (items                  ) => {
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
		columns: 20,
		description: 'Insert emoji',
		id: 'sparkling-emoji',
		multiselect: true
	}
}
