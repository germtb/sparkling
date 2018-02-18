import { h } from 'preact'
import { spawn } from 'child_process'
import { connect } from 'preact-redux'

import { getReplace } from '../selectors'
import loadDataFactory from './dataSources/find'
import renderer from './renderers/replace'
import commandFactory from './commandFactory'

import Input from '../components/Input'

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
		const { lineNumber, path, find } = item
		const cwd = atom.project.getPaths()[0]

		const sedRegex = `${lineNumber},${lineNumber}s/${find}/${replace}/`
		spawn('sed', ['-i', '', '-e', sedRegex, path], {
			cwd
		})
		store.dispatch({
			type: 'REMOVE_ITEM',
			payload: item
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
