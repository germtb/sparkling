import { h, Component } from 'preact'
import { spawn } from 'child_process'
import { connect } from 'preact-redux'

import { getReplace } from '../selectors'
import loadDataFactory from './dataSources/find'
import renderer from './renderers/replace'
import commandFactory from './commandFactory'

class ReplaceInput extends Component {
	componentDidMount() {
		this.input.focus()
	}

	render() {
		const { setReplace, replace } = this.props

		return (
			<input
				tabIndex={0}
				className="sparkling-input sparkling-replace native-key-bindings"
				placeholder="Replace"
				onInput={event => {
					setReplace(event.target.value)
				}}
				value={replace}
				ref={input => {
					this.input = input
				}}
			/>
		)
	}
}

const ReplaceInputContainer = connect(
	state => ({
		replace: getReplace(state)
	}),
	dispatch => ({
		setReplace: replace =>
			dispatch({ type: 'SET_REPLACE', payload: { replace } })
	})
)(ReplaceInput)

const replaceFactory = (h, store) => {
	const loadData = loadDataFactory(store)

	const accept = item => {
		const { lineNumber, path, find, replace } = item
		const cwd = atom.project.getPaths()[0]

		const sedRegex = `${lineNumber},${lineNumber + 1}s/${find}/${replace}/`
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
		id: 'replace-in-project',
		children: () => <ReplaceInputContainer />
	}
}

export default commandFactory(replaceFactory)
