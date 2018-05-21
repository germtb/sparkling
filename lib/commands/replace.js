import nodePath from 'path'

import { fileReplace, compose } from '../utils'

import {
	getReplace,
	getSelectedValue,
	getFind,
	isSmartCase,
	// getScope,
	isLiteralSearch
} from '../selectors'

import loadDataFactory from './dataSources/find'
import rendererFactory from './renderers/replace'

export default dependencies => {
	const { React, store, components, connect, fromSelector, classnames } = dependencies

	const { Input, withSideEffect } = components

	let cancelLoadData = null

	const ReplaceInputContainer = compose(
		withSideEffect(fromSelector(getSelectedValue))(result => {
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
		}),
		withSideEffect(fromSelector(getFind))(find => {
			if (cancelLoadData && typeof cancelLoadData === 'function') {
				cancelLoadData()
				cancelLoadData = null
			}

			if (!find || find.length < 1) {
				store.dispatch({ type: 'RELOAD' })
				return
			}

			let first = true

			cancelLoadData = loadData(data => {
				store.dispatch({
					type: 'APPEND_DATA',
					payload: {
						data,
						set: first
					}
				})

				first = false
			})
		}),
		connect(
			state => ({
				value: getFind(state),
				replace: getReplace(state),
				smartCase: isSmartCase(state),
				literalSearch: isLiteralSearch(state),
				// scope: getScope(state),
			}),
			dispatch => ({
				setValue: find => dispatch({ type: 'SET_SEARCH', payload: { find } }),
				toggleSmartCase: () => dispatch({ type: 'TOGGLE_SMART_CASE' }),
				toggleLiteralSearch: () => dispatch({ type: 'TOGGLE_LITERAL_SEARCH' }),
				setScope: scope => dispatch({ type: 'SET_SCOPE', payload: { scope } }),
				toggleWholeWord: () => dispatch({ type: 'TOGGLE_WHOLE_WORD' }),
				setReplace: replace =>
					dispatch({ type: 'SET_REPLACE', payload: { replace } })
			})
		)
	)(
		({
			value,
			setValue,
			smartCase,
			literalSearch,
			toggleSmartCase,
			toggleLiteralSearch,
			replace,
			setReplace
		}) => (
			<React.Fragment>
				<Input
					autoFocus
					tabIndex={0}
					className="sparkling-find-input"
					id="sparkling-find"
					placeholder="Find"
					setValue={setValue}
					value={value}
				/>
				<Input
					tabIndex={1}
					id="sparkling-replace"
					className="sparkling-replace"
					placeholder="Replace"
					setValue={setReplace}
					value={replace}
				/>
				<div className="sparkling-find-options">
					<button
						onClick={toggleSmartCase}
						className={classnames('sparkling-toggle', {
							['sparkling-toggle-active']: smartCase
						})}
					>
						Smart case
					</button>
					<button
						onClick={toggleLiteralSearch}
						className={classnames('sparkling-toggle', {
							['sparkling-toggle-active']: literalSearch
						})}
					>
						Literal search
					</button>
				</div>
			</ React.Fragment>
		)
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
		childrenRenderer: () => <ReplaceInputContainer />
	}
}
