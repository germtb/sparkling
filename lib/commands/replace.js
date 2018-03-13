import nodePath from 'path'

import { getReplace, getSelectedValue } from '../selectors'
import { fileReplace } from '../utils'

import loadDataFactory from './dataSources/find'
import rendererFactory from './renderers/replace'

export default dependencies => {
	const { React, store, components, connect, fromSelector } = dependencies

	const { Input, withSideEffect } = components

	const ReplaceInput = ({ value, setValue }) => (
		<Input
			autoFocus
			tabIndex={0}
			className="sparkling-replace"
			placeholder="Replace"
			setValue={setValue}
			value={value}
		/>
	)

	const withReplaceSideEffect = withSideEffect(fromSelector(getSelectedValue))(
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
				[startLine, startColumn],
				[endLine, endColumn]
			])
		}
	)

	const ReplaceInputContainer = withReplaceSideEffect(
		connect(
			state => ({
				value: getReplace(state)
			}),
			dispatch => ({
				setValue: replace =>
					dispatch({ type: 'SET_REPLACE', payload: { replace } })
			})
		)(ReplaceInput)
	)

	const renderer = rendererFactory(dependencies)

	const loadData = loadDataFactory(store)

	const accept = item => {
		const replace = getReplace(store.getState())
		const { path, endColumn, endLine, startColumn, startLine } = item

		fileReplace({
			path,
			endColumn,
			endLine,
			startColumn,
			startLine,
			replace
		}).then(() => {
			store.dispatch({
				type: 'RELOAD'
			})
		})
	}

	return {
		loadData,
		accept,
		renderer,
		description: 'Replace pattern in project',
		id: 'sparkling-project-replace',
		sliceLength: 10,
		childrenRenderer: () => <ReplaceInputContainer />
	}
}
