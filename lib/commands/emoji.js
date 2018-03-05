import loadEmojiFactory from './dataSources/emoji'
import rendererFactory from './renderers/emoji'

export default dependencies => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadEmojiFactory(store)

	const accept = ({ emoji }) => {
		const editor = atom.workspace.getActiveTextEditor()

		store.dispatch({ type: 'HIDE' })
		editor.insertText(emoji)
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
