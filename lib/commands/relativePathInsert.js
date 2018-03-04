import path from 'path'

import loadData from './dataSources/allFiles'
import rendererFactory from './renderers/file'

export default dependencies => {
	const renderer = rendererFactory(dependencies)

	const { store } = dependencies

	const accept = ({ value }) => {
		const editor = atom.workspace.getActiveTextEditor()
		const projectPath = atom.project.getPaths()[0]
		const originPath = editor.getPath()
		const dir = path.dirname(originPath)
		const targetPath = path.resolve(projectPath, value)
		const relativePath = path.relative(dir, targetPath)
		store.dispatch({ type: 'HIDE' })
		editor.insertText(relativePath)
	}

	return {
		loadData,
		accept,
		renderer,
		sliceLength: 20,
		columns: 4,
		description: 'Copy relative path',
		id: 'sparkling-copy-relative-path'
	}
}
