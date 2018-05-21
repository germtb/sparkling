import nodePath from 'path'

import loadDataFactory from './dataSources/find'
import rendererFactory from './renderers/find'

import { compose } from '../utils'

import {
	getSelectedValue,
	getFind,
	isSmartCase,
	getScope,
	isLiteralSearch,
	isWholeWord
} from '../selectors'

export default dependencies => {
	const {
		React,
		store,
		connect,
		fromSelector,
		classnames,
		components: { withSideEffect, Input }
	} = dependencies

	const renderer = rendererFactory(dependencies)

	const loadData = loadDataFactory(store)

	const accept = result => {
		const { startLine, startColumn, endLine, endColumn, path } = result

		store.dispatch({ type: 'HIDE' })

		atom.workspace.open(path).then(editor => {
			editor.setSelectedBufferRange([
				[startLine, startColumn],
				[endLine, endColumn]
			])
		})
	}

	let cancelLoadData = null

	const FindSideEffect = compose(
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
				smartCase: isSmartCase(state),
				literalSearch: isLiteralSearch(state),
				scope: getScope(state),
				wholeWord: isWholeWord(state)
			}),
			dispatch => ({
				setValue: find => dispatch({ type: 'SET_SEARCH', payload: { find } }),
				toggleSmartCase: () => dispatch({ type: 'TOGGLE_SMART_CASE' }),
				toggleLiteralSearch: () => dispatch({ type: 'TOGGLE_LITERAL_SEARCH' }),
				setScope: scope => dispatch({ type: 'SET_SCOPE', payload: { scope } }),
				toggleWholeWord: () => dispatch({ type: 'TOGGLE_WHOLE_WORD' })
			})
		)
	)(
		({
			value,
			setValue,
			smartCase,
			literalSearch,
			toggleSmartCase,
			toggleLiteralSearch
		}) => (
			<div className="sparkling-find">
				<Input
					autoFocus
					tabIndex={0}
					className="sparkling-find-input"
					id="sparkling-find"
					placeholder="Find"
					setValue={setValue}
					value={value}
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
			</div>
		)
	)

	return {
		loadData,
		accept,
		renderer,
		description: 'Find pattern in project',
		id: 'sparkling-project-find',
		childrenRenderer: () => <FindSideEffect />
	}
}
