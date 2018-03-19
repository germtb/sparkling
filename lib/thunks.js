// @flow

import type { Thunk } from './types'

import {
	getOptions,
	getIndex,
	getSparklingData,
	getSelectedValue,
	getExtraInput,
	isFindVisible,
	getPattern,
	getMultiselected
} from './selectors'
import { spawnInProject } from './utils'

export const next = (): Thunk => (dispatch, getState) => {
	const state = getState()
	const index = getIndex(state)
	const sparklingData = getSparklingData(state)
	const options = getOptions(state)
	const { columns } = options

	const value = Math.min(index + columns, sparklingData.length - 1)
	dispatch({ type: 'SET_INDEX', payload: { value } })
}

export const previous = (): Thunk => (dispatch, getState) => {
	const state = getState()
	const index = getIndex(state)
	const options = getOptions(state)
	const { columns } = options

	const value = Math.max(index - columns, 0)
	dispatch({ type: 'SET_INDEX', payload: { value } })
}

export const left = (): Thunk => (dispatch, getState) => {
	const state = getState()
	const index = getIndex(state)

	const value = Math.max(index - 1, 0)
	dispatch({ type: 'SET_INDEX', payload: { value } })
}

export const right = (): Thunk => (dispatch, getState) => {
	const state = getState()
	const index = getIndex(state)
	const sparklingData = getSparklingData(state)

	const value = Math.min(index + 1, sparklingData.length - 1)
	dispatch({ type: 'SET_INDEX', payload: { value } })
}

export const hide = (): Thunk => dispatch => {
	dispatch({ type: 'HIDE' })
}

export const accept = (): Thunk => (dispatch, getState) => {
	const state = getState()
	const item = getSelectedValue(state)
	const { accept, multiselect } = getOptions(state)

	if (multiselect) {
		const multiselected = getMultiselected(state)

		if (item) {
			const set = multiselected.includes(item)
				? multiselected
				: [...multiselected, item]
			accept(set)
		} else {
			accept(multiselected)
		}
	} else if (item) {
		accept(item)
	}
}

export const findToggle = (
	{ find, scope }: { find: string, scope: string } = { find: '', scope: '' }
): Thunk => (dispatch, getState) => {
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

export const copyFilesConfirm = (
	onDone: ({ id?: string, +value: string }) => void
): Thunk => (dispatch, getState) => {
	const extraInput = getExtraInput(getState())
	const cmdProcess = spawnInProject('cp', [
		extraInput.originPath,
		extraInput.value
	])
	cmdProcess.on('exit', () => onDone(extraInput))
}

export const moveFilesConfirm = (
	onDone: ({ id?: string, +value: string }) => void
): Thunk => (dispatch, getState) => {
	const extraInput = getExtraInput(getState())
	const cmdProcess = spawnInProject('mv', [
		extraInput.originPath,
		extraInput.value
	])
	cmdProcess.on('exit', () => onDone(extraInput))
}

export const togglePattern = ({ pattern }: { pattern: string }): Thunk => (
	dispatch,
	getState
) => {
	const currentPattern = getPattern(getState())
	dispatch({
		type: 'SET_PATTERN',
		payload: { pattern: currentPattern === pattern ? '' : pattern }
	})
}

export const select = (): Thunk => (dispatch, getState) => {
	const state = getState()
	const item = getSelectedValue(state)
	const options = getOptions(state)

	if (options.multiselect) {
		dispatch({ type: 'SELECT', payload: { item } })
		dispatch(next())
	}
}
