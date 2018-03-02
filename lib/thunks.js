import {
	getOptions,
	getIndex,
	getOffset,
	getSparklingData,
	getSelectedValue,
	getExtraInput,
	isFindVisible
} from './selectors'
import { spawnInProject } from './utils'

export const next = () => (dispatch, getState) => {
	const state = getState()
	const index = getIndex(state)
	const sparklingData = getSparklingData(state)
	const options = getOptions(state)
	const { sliceLength } = options

	if (index === sliceLength - 1) {
		const offset = getOffset(state)
		const value = Math.min(offset + 1, sparklingData.length - sliceLength)
		dispatch({ type: 'SET_OFFSET', payload: { value } })
	} else {
		const value = Math.min(index + 1, sparklingData.length - 1, sliceLength - 1)
		dispatch({ type: 'SET_INDEX', payload: { value } })
	}
}

export const previous = () => (dispatch, getState) => {
	const state = getState()
	const index = getIndex(state)

	if (index === 0) {
		const offset = getOffset(state)
		const value = Math.max(offset - 1, 0)
		dispatch({ type: 'SET_OFFSET', payload: { value } })
	} else {
		const value = Math.max(index - 1, 0)
		dispatch({ type: 'SET_INDEX', payload: { value } })
	}
}

export const left = () => (dispatch, getState) => {
	const state = getState()
	const index = getIndex(state)
	const options = getOptions(state)
	const { columns, sliceLength } = options
	const rows = sliceLength / columns

	if (index === 0) {
		const offset = getOffset(state)
		const value = Math.max(offset - rows, 0)
		dispatch({ type: 'SET_OFFSET', payload: { value } })
	} else {
		const value = Math.max(index - rows, 0)
		dispatch({ type: 'SET_INDEX', payload: { value } })
	}
}

export const right = () => (dispatch, getState) => {
	const state = getState()
	const index = getIndex(state)
	const sparklingData = getSparklingData(state)
	const options = getOptions(state)
	const { sliceLength, columns } = options
	const rows = sliceLength / columns

	if (index === sliceLength - 1) {
		const offset = getOffset(state)
		const value = Math.min(offset + rows, sparklingData.length - sliceLength)
		dispatch({ type: 'SET_OFFSET', payload: { value } })
	} else {
		const value = Math.min(
			index + rows,
			sparklingData.length - 1,
			sliceLength - 1
		)
		dispatch({ type: 'SET_INDEX', payload: { value } })
	}
}

export const hide = () => dispatch => {
	dispatch({ type: 'HIDE' })
}

export const accept = () => (dispatch, getState) => {
	const state = getState()
	const value = getSelectedValue(state)

	if (value === null || value === undefined) {
		return
	}

	const { accept } = getOptions(state)
	accept(value)
}

export const findToggle = ({ find, scope } = {}) => (dispatch, getState) => {
	const findInput = document.querySelector(
		'#sparkling-project-find #sparkling-input'
	)
	const replaceInput = document.querySelector(
		'#sparkling-project-replace #sparkling-input'
	)

	if (findInput && findInput !== document.activeElement) {
		findInput.focus()
	} else if (replaceInput && replaceInput !== document.activeElement) {
		replaceInput.focus()
	} else if (isFindVisible(getState())) {
		dispatch({ type: 'HIDE' })
	} else {
		dispatch({ type: 'SHOW_SEARCH', payload: { find, scope } })
	}
}

export const lsShow = (path, ls) => () => {
	ls({ path, description: path, command: ls })
}

export const lsShowUp = (path, ls) => (dispatch, getState) => {
	const { path: optionsPath } = getOptions(getState())
	const finalPath = path.resolve(optionsPath, '..')
	ls({ path: finalPath, description: finalPath, command: ls })
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
