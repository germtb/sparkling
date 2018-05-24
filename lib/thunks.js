import {
	getOptions,
	getIndex,
	getSparklingData,
	getSelectedValue,
	getExtraInput,
	getPattern,
	getMultiselected
} from './selectors'
import { spawnInProject } from './utils'

export const next = () => (dispatch, getState) => {
	const state = getState()
	const index = getIndex(state)
	const sparklingData = getSparklingData(state)
	const value = Math.min(index + 1, sparklingData.length - 1)
	dispatch({ type: 'SET_INDEX', payload: { value } })
}

export const previous = () => (dispatch, getState) => {
	const state = getState()
	const index = getIndex(state)
	const value = Math.max(index - 1, 0)
	dispatch({ type: 'SET_INDEX', payload: { value } })
}

export const left = () => (dispatch, getState) => {
	const state = getState()
	const index = getIndex(state)
	const options = getOptions(state)
	const { columns, sliceLength } = options
	const rows = sliceLength / columns

	const value = Math.max(index - rows, 0)
	dispatch({ type: 'SET_INDEX', payload: { value } })
}

export const right = () => (dispatch, getState) => {
	const state = getState()
	const index = getIndex(state)
	const sparklingData = getSparklingData(state)
	const options = getOptions(state)
	const { sliceLength, columns } = options
	const rows = sliceLength / columns

	const value = Math.min(
		index + rows,
		sparklingData.length - 1,
	)
	dispatch({ type: 'SET_INDEX', payload: { value } })
}

export const hide = () => dispatch => {
	dispatch({ type: 'HIDE' })
}

export const accept = () => (dispatch, getState) => {
	const state = getState()
	const item = getSelectedValue(state)
	const options = getOptions(state)

	if (options.multiselect) {
		const multiselected = getMultiselected(state)

		if (item) {
			const set = multiselected.includes(item)
				? multiselected
				: [...multiselected, item]
			options.accept(set)
		} else {
			options.accept(multiselected)
		}
	} else if (item) {
		options.accept(item)
	}
}

export const copyFilesConfirm = onDone => (dispatch, getState) => {
	const extraInput = getExtraInput(getState())
	const cmdProcess = spawnInProject('cp', [
		extraInput.originPath,
		extraInput.value
	])
	cmdProcess.on('exit', () => onDone(extraInput))
}

export const moveFilesConfirm = onDone => (dispatch, getState) => {
	const extraInput = getExtraInput(getState())
	const cmdProcess = spawnInProject('mv', [
		extraInput.originPath,
		extraInput.value
	])
	cmdProcess.on('exit', () => onDone(extraInput))
}

export const togglePattern = ({ pattern }) => (dispatch, getState) => {
	const currentPattern = getPattern(getState())
	dispatch({
		type: 'SET_PATTERN',
		payload: { pattern: currentPattern === pattern ? '' : pattern }
	})
}

export const select = () => (dispatch, getState) => {
	const state = getState()
	const item = getSelectedValue(state)
	const options = getOptions(state)

	if (options.multiselect) {
		dispatch({ type: 'SELECT', payload: { item } })
		dispatch(next())
	}
}
