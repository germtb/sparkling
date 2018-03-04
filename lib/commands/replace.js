import { getReplace } from '../selectors'
import { fileReplace } from '../utils'

import loadDataFactory from './dataSources/find'
import rendererFactory from './renderers/replace'

export default dependencies => {
	const { React, store, components, connect } = dependencies

	const { Input } = components

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

	const ReplaceInputContainer = connect(
		state => ({
			value: getReplace(state)
		}),
		dispatch => ({
			setValue: replace =>
				dispatch({ type: 'SET_REPLACE', payload: { replace } })
		})
	)(ReplaceInput)

	const renderer = rendererFactory(dependencies)

	const loadData = loadDataFactory(store)

	const accept = item => {
		const replace = getReplace(store.getState())
		const { lineNumber, path, match, column, line } = item

		fileReplace({
			line,
			lineNumber,
			path,
			column,
			match,
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
