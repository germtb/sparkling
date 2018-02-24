import { h } from 'preact'
import { connect } from 'preact-redux'

import { getReplace } from '../selectors'
import Input from '../components/Input'
import { fileReplace } from '../utils'

import loadDataFactory from './dataSources/find'
import renderer from './renderers/replace'
import commandFactory from './commandFactory'

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
		setValue: replace => dispatch({ type: 'SET_REPLACE', payload: { replace } })
	})
)(ReplaceInput)

const replaceFactory = (h, store) => {
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

export default commandFactory(replaceFactory)
