import path from 'path'

import store from './store'
import {
	getOptions,
	getIndex,
	getOffset,
	getSparklingData,
	getSelectedValue,
	isFindVisible,
	isReplaceVisible
} from './selectors'
import ls from './commands/ls'

export const next = () => {
	const state = store.getState()
	const index = getIndex(state)
	const sparklingData = getSparklingData(state)

	if (index === 9) {
		const offset = getOffset(state)
		const value = Math.min(offset + 1, sparklingData.length - 10)
		store.dispatch({ type: 'SET_OFFSET', payload: { value } })
	} else {
		const value = Math.min(index + 1, sparklingData.length - 1, 9)
		store.dispatch({ type: 'SET_INDEX', payload: { value } })
	}
}

export const previous = () => {
	const state = store.getState()
	const index = getIndex(state)

	if (index === 0) {
		const offset = getOffset(state)
		const value = Math.max(offset - 1, 0)
		store.dispatch({ type: 'SET_OFFSET', payload: { value } })
	} else {
		const value = Math.max(index - 1, 0)
		store.dispatch({ type: 'SET_INDEX', payload: { value } })
	}
}

export const hide = () => {
	store.dispatch({ type: 'HIDE' })
}

export const accept = () => {
	const state = store.getState()
	const value = getSelectedValue(state)

	if (value === null || value === undefined) {
		return
	}

	const { accept } = getOptions(state)
	accept(value)
}

export const findToggle = () => {
	const findInput = document.querySelector('#sparkling-project-find #sparkling-input')

	if (findInput && findInput !== document.activeElement) {
		findInput.focus()
	} else if (isFindVisible(store.getState())) {
		store.dispatch({ type: 'HIDE_SEARCH' })
	} else {
		store.dispatch({ type: 'SHOW_SEARCH' })
	}
}

export const replaceToggle = () => {
	const replaceInput = document.querySelector(
		'#replace-in-project #sparkling-input'
	)

	if (replaceInput && replaceInput !== document.activeElement) {
		replaceInput.focus()
	} else if (isReplaceVisible(store.getState())) {
		store.dispatch({ type: 'HIDE_REPLACE' })
	} else {
		store.dispatch({ type: 'SHOW_REPLACE' })
	}
}

export const lsShow = () => {
	const activeTextEditor = atom.workspace.getActiveTextEditor()
	const finalPath = activeTextEditor
		? path.dirname(activeTextEditor.getPath())
		: atom.project.getPaths()[0]
	ls({ path: finalPath })
}

export const lsShowUp = () => {
	const { path: optionsPath } = getOptions(store.getState())
	const finalPath = path.resolve(optionsPath, '..')
	ls({ path: finalPath })
}
