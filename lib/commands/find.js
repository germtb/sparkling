// @flow

import fs from 'fs'
import path from 'path'

import loadDataFactory from './dataSources/find'
import rendererFactory from './renderers/find'

import { getScope } from '../selectors'

import type { Dependencies, Options } from '../types'

export default (dependencies: Dependencies): Options => {
	const { store } = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadDataFactory(store)

	const accept = value => {
		const scope = getScope(store.getState())
		const cwd = atom.project.getPaths()[0]
		const absolutePath = path.resolve(cwd, `.${scope}`)

		if (value && scope !== '' && fs.lstatSync(absolutePath).isFile()) {
			store.dispatch({ type: 'HIDE' })
		}

		atom.workspace.open(value.path, {
			initialLine: value.lineNumber - 1,
			initialColumn: value.column
		})
	}

	return {
		loadData,
		accept,
		renderer,
		description: 'Find pattern in project',
		id: 'sparkling-project-find',
		sliceLength: 10,
		columns: 1,
		onValue: value => {
			const scope = getScope(store.getState())
			const cwd = atom.project.getPaths()[0]
			const absolutePath = path.resolve(cwd, `.${scope}`)

			if (value && scope !== '' && fs.lstatSync(absolutePath).isFile()) {
				const editor = atom.workspace.getActiveTextEditor()
				editor.setCursorBufferPosition([value.lineNumber - 1, value.column])
				const cursor = editor.cursors[0]
				cursor.moveToFirstCharacterOfLine()
			}
		}
	}
}
