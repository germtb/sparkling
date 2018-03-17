// @flow

// import fs from 'fs'
import nodePath from 'path'

import loadDataFactory from './dataSources/find'
import rendererFactory from './renderers/find'

import { getSelectedValue } from '../selectors'
// import { getScope, getSelectedValue } from '../selectors'

import type { Dependencies, AckmateItem } from '../types'

export default (dependencies: Dependencies) => {
	const {
		React,
		store,
		fromSelector,
		components: { withSideEffect }
	} = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadDataFactory(store)

	const accept = (result: AckmateItem) => {
		const { startLine, startColumn, endLine, endColumn, path } = result
		// const scope = getScope(store.getState())
		// const cwd = atom.project.getPaths()[0]
		// const absolutePath = nodePath.resolve(cwd, `.${scope}`)

		// if (result && scope !== '' && fs.lstatSync(absolutePath).isFile()) {
		store.dispatch({ type: 'HIDE' })
		// }

		atom.workspace.open(path).then(editor => {
			editor.setSelectedBufferRange([
				[startLine, startColumn],
				[endLine, endColumn]
			])
		})
	}

	const FindSideEffect = withSideEffect(fromSelector(getSelectedValue))(
		result => {
			if (!result) {
				return
			}

			const { startLine, startColumn, endLine, endColumn, path } = result

			const editor = atom.workspace.getActiveTextEditor()

			if (!editor) {
				return
			}

			const cwd = atom.project.getPaths()[0]
			const absolutePath = nodePath.resolve(cwd, `./${path}`)

			if (absolutePath !== editor.getPath()) {
				return
			}

			editor.setSelectedBufferRange([
				[startLine, startColumn],
				[endLine, endColumn]
			])
		}
	)(() => null)

	return {
		loadData,
		accept,
		renderer,
		description: 'Find pattern in project',
		id: 'sparkling-project-find',
		sliceLength: 10,
		columns: 1,
		childrenRenderer: () => <FindSideEffect />
	}
}
