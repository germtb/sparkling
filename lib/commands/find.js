// @flow

import fs from 'fs'
import nodePath from 'path'

import loadDataFactory from './dataSources/find'
import rendererFactory from './renderers/find'

import { getScope, getSelectedValue } from '../selectors'

import type { Dependencies, Options } from '../types'

export default (dependencies: Dependencies): Options => {
	const {
		React,
		store,
		fromSelector,
		components: { withSideEffect }
	} = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadDataFactory(store)

	const accept = value => {
		const scope = getScope(store.getState())
		const cwd = atom.project.getPaths()[0]
		const absolutePath = nodePath.resolve(cwd, `.${scope}`)

		if (value && scope !== '' && fs.lstatSync(absolutePath).isFile()) {
			store.dispatch({ type: 'HIDE' })
		}

		atom.workspace.open(value.path, {
			initialLine: value.startLine - 1,
			initialColumn: value.startColumn
		})
	}

	const FindSideEffect = withSideEffect(fromSelector(getSelectedValue))(
		result => {
			if (!result) {
				return
			}

			const { startLine, startColumn, endLine, endColumn, path } = result

			const editor = atom.workspace.getActiveTextEditor()

			const cwd = atom.project.getPaths()[0]
			const absolutePath = nodePath.resolve(cwd, `./${path}`)

			if (absolutePath !== editor.getPath()) {
				return
			}

			editor.setSelectedBufferRange([
				[startLine - 1, startColumn],
				[endLine - 1, endColumn]
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
